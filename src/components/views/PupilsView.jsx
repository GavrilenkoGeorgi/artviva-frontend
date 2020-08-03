import React, { Suspense, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { initializePupils, initialiseUserPupils } from '../../reducers/pupilsReducer'

import { Container, Row, Col, Form } from 'react-bootstrap'
import PupilsList from '../pupils/PupilsList'
import { LoadingIndicator } from '../common'
import { removeFalsyProps, pureObjectIsEmpty } from '../../utils/objectHelpers'

import { filter, select, boolean } from '../../data/forms/pupilFields.json'
import { multiPropsFilter, boolPropsFilter } from '../../utils/arrayHelpers'
import { FilterData as FilterString, ShowFilterSettings,
	SelectFields, FilterBooleanFields } from '../sorting'

import Reset from '../forms/buttons/Reset'
import { Button } from '../common/buttons'
import PupilForm from '../forms/PupilForm'
import CommonLayout from './CommonLayout'
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const PupilsView = ({ user, pupils, initializePupils, initialiseUserPupils }) => {

	const [userData, setUser] = useState({})
	const [pupilsList, setPupils] = useState([])
	const [filterSettings, setFilterSettings] = useState({})
	const [editModalShow, setEditModalShow] = useState(false)

	useEffect(() => {
		if (user) setUser(user)
	}, [user, userData])

	useEffect(() => {
		setPupils(pupils)
	}, [pupils])

	const selectData = useCallback((arrayOfStuff) => {
		// extract already filtered props
		// eslint-disable-next-line
		const { name, specialty, from, to, ...filterData } = filterSettings
		return multiPropsFilter(arrayOfStuff, filterData)
	}, [filterSettings])

	const sortData = useCallback(settings => {
		let result = pupils
		if (settings) {
			// name, specialty and benefits values
			const { name, specialty, hasBenefit } = settings
			const boolFieldsList = boolean.map(item => item.field)

			if (specialty) {
				result =
					result.filter(item => item.specialty.title.toUpperCase().includes(settings.specialty.toUpperCase()))
			}

			if (name) {
				result =
					result.filter(item => item.name.toUpperCase().includes(settings.name.toUpperCase()))
			}

			const boolFilter = {}
			for (let field of boolFieldsList) {
				const value = settings[field]
				if (typeof value === 'boolean') {
					boolFilter[field] = settings[field]
				}
			}

			if (boolFilter) {
				result = boolPropsFilter(result, boolFilter)
			}

			if (hasBenefit !== undefined) { // 0 percent benefits messes this up
				result = result.filter(item => item.hasBenefit === hasBenefit)
			}

			setPupils([ ...selectData(result) ])
		} else { // reset
			setPupils([ ...pupils ])
		}
	}, [pupils, selectData])

	useEffect(() => {
		if (pureObjectIsEmpty(removeFalsyProps(filterSettings))) {
			sortData(false)
		} else {
			sortData(filterSettings)
		}
	}, [filterSettings, sortData])

	const changeFilterSetting = (event) => {
		event.preventDefault()

		const { target } = event
		const { name: field, value } = target

		switch (field) {
		case 'name':
		case 'specialty': {
			if (value) {
				setFilterSettings({ ...filterSettings, [field]: value })
			}
			else {
				setFilterSettings({ [field]: '' })
			}
			break
		}
		case 'docsPresent':
		case 'graduated':
		case 'suspended':
		case 'currentlyEnrolled': {
			let statement
			if (value) {
				statement = JSON.parse(value)
			} else {
				statement = ''
			}
			setFilterSettings({ ...filterSettings, [field]: statement })
			break
		}
		case 'hasBenefit': {
			const percent = value === 'Немає пільг' ? 0 : !value ? '' : Number(value)
			setFilterSettings({ ...filterSettings, [field]: percent })
			break
		}
		default: {
			setFilterSettings({ ...filterSettings, [field]: value })
		}
		}
	}

	return (
		<CommonLayout>
			<Container>
				<Row>
					<Col xs={12}>
						<h4 className="custom-font text-center">
							{userData.superUser
								? 'Всі учні школи'
								: 'Ваши учні'
							}
						</h4>
					</Col>
					<Col xs={12} className="pb-3">
						{/*For example: to find out how many pupils are studiying one faculty,
							enter a few letters from it's title and sort by it.
							To add new pupil, use the form below.*/}
						<section className="p-3 school-explained custom-font-small">
							<p>
								Наприклад: щоб дізнатись, скільки студентів навчається на одному факультеті,{' '}
								введіть кілька літер від його назви та відсортуйте за ним.
							</p>
							<p>
								Щоб додати нового учня, заповніть форму натиснув кнопку нижче.
							</p>
						</section>
					</Col>
					{/*controls*/}
					<Form onReset={() => setFilterSettings({})}>
						<Col xs={12} className="py-2">
							<Row>
								<FilterString
									filter={changeFilterSetting}
									fieldName="name"
									placeholder="І'мя"
								/>
								<FilterString
									filter={changeFilterSetting}
									fieldName="specialty"
									placeholder="Назва фаху"
								/>
							</Row>
						</Col>
						<Col xs={12}>
							<FilterBooleanFields
								selectBy={boolean}
								filter={changeFilterSetting}
							/>
						</Col>
						<Col xs={12}>
							<SelectFields
								selectBy={select}
								filter={changeFilterSetting}
							/>
						</Col>
						<Col xs={12}>
							<ShowFilterSettings
								labels={[ ...filter, ...select, ...boolean ]}
								settings={filterSettings}
							/>
						</Col>
						<Col xs={12} className="pt-4">
							<Row>
								<Col xs={6}>
									<Button
										block
										dataCy="add-new-pupil"
										label="Додати нового"
										onClick={() => setEditModalShow(true)}
									/>
								</Col>
								<Col xs={6}>
									<Reset
										label="Показати всіх"
										block
										variant="outline-success"
										dataCy="filter-reset-btn"
										disabled={pureObjectIsEmpty(filterSettings)}
									/>
								</Col>
							</Row>
						</Col>
					</Form>

					<Col xs={12} className="py-4">
						<div className="text-right pb-2 ">
							<em className="text-muted">Загалом: {pupilsList.length}</em>
						</div>
						{userData.superUser
							? <PupilsList list={pupilsList} getPupils={initializePupils} />
							: <PupilsList list={pupilsList} getPupils={initialiseUserPupils} />
						}
					</Col>
					<Suspense fallback={
						<LoadingIndicator
							animation="border"
							variant="primary"
							size="md"
						/>}>
						<LazyEntityEditModal
							subject="Додати нового учня"
							show={editModalShow}
							onHide={() => setEditModalShow(false)}
						>
							<PupilForm mode="create" />
						</LazyEntityEditModal>
					</Suspense>
				</Row>
			</Container>
		</CommonLayout>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		pupils: state.pupils
	}
}

const mapDispatchToProps = {
	initializePupils,
	initialiseUserPupils
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilsView)
