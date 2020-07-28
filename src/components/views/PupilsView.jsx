import React, { Suspense, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { initializePupils, initialiseUserPupils } from '../../reducers/pupilsReducer'

import { Container, Row, Col } from 'react-bootstrap'
import PupilsList from '../pupils/PupilsList'
import { LoadingIndicator, CollapseComponent } from '../common'
import { removeFalsyProps, pureObjectIsEmpty } from '../../utils/objectHelpers'

import { multiPropsFilter, boolPropsFilter } from '../../utils/arrayHelpers'
import { pupilBoolFields, pupilSelectFields } from '../../data/forms/pupilFields.json'
import { FilterData as FilterString,
	FilterDisplay, SelectFields, FilterBooleanFields } from '../sorting'

const LazyPupilForm = React.lazy(() => import('../forms/PupilForm'))

const PupilsView = ({ user, pupils, initializePupils, initialiseUserPupils }) => {

	const [userData, setUser] = useState({})
	const [pupilsList, setPupils] = useState([])
	const [filterSettings, setFilterSettings] = useState({})
	const [currentlyActiveFilter, setCurrentlyActiveFilter] = useState('')

	useEffect(() => {
		if (user) setUser(user)
	}, [user, userData])

	useEffect(() => {
		setPupils(pupils)
	}, [pupils])

	const selectData = useCallback((arrayOfStuff) => {
		// eslint-disable-next-line
		const { name, from, to, ...filterData } = filterSettings
		return multiPropsFilter(arrayOfStuff, filterData)
	}, [filterSettings])

	const sortData = useCallback(settings => {
		let result = pupils
		if (settings) {
			const { name, specialty, docsPresent, currentlyEnrolled } = settings

			if (specialty) {
				result =
					result.filter(item => item.specialty.title.toUpperCase().includes(settings.specialty.toUpperCase()))
			}

			if (name) {
				result =
					result.filter(item => item.name.toUpperCase().includes(settings.name.toUpperCase()))
			}

			const boolFilter =
			(typeof docsPresent === 'boolean' && typeof currentlyEnrolled === 'boolean')
				? { docsPresent, currentlyEnrolled } :
				(typeof docsPresent === 'boolean') ? { docsPresent } :
					(typeof currentlyEnrolled === 'boolean') ? { currentlyEnrolled } : false

			if (boolFilter) {
				result = boolPropsFilter(result, boolFilter)
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
		default: {
			setFilterSettings({ ...filterSettings, [field]: value })
			setCurrentlyActiveFilter('select')
		}
		}
	}

	return (
		<Container className="px-0 d-flex justify-content-center">
			<Col xs={12} lg={9} className="d-flex justify-content-center">
				<Row className="border1 border-primary d-flex justify-content-center">
					<Col xs={12} className="py-2">
						<h3 className="custom-font text-center border1">
							{userData.superUser
								? 'Всі учні школи'
								: 'Ваши учні'
							}
						</h3>
					</Col>
					<Col xs={12} className="pb-3 school-explained1 custom-font-small1">
						{/*For example: to find out how many pupils are studiying one faculty,
							enter a few letters from it's title and sort by it.
							To add new pupil, use the form below.*/}
						<section className="p-3 border rounded school-explained custom-font-small">
							<p>
								Наприклад: щоб дізнатись, скільки студентів навчається на одному факультеті,{' '}
								введіть кілька літер від його назви та відсортуйте за ним.
							</p>
							<p>
								Щоб додати нового учня, скористайтеся формою нижче.
							</p>
						</section>

					</Col>
					<Col xs={6} className="py-2">
						<FilterString
							filter={changeFilterSetting}
							fieldName="name"
							placeholder="І'мя"
						/>
					</Col>
					<Col xs={6} className="py-2">
						<FilterString
							filter={changeFilterSetting}
							fieldName="specialty"
							placeholder="Назва фаху"
						/>
					</Col>
					<Col xs={12}>
						<FilterBooleanFields
							selectBy={pupilBoolFields}
							filter={changeFilterSetting}
						/>
					</Col>
					<Col xs={12}>
						<SelectFields
							selectBy={pupilSelectFields}
							filter={changeFilterSetting}
						/>
					</Col>
					<Col xs={12}>
						<FilterDisplay
							settings={filterSettings}
							currentFilter={currentlyActiveFilter}
						/>
					</Col>
					<Col xs={12} className="py-4 border1">
						<div className="text-right pb-2 ">
							<em className="text-muted">Загалом: {pupilsList.length}</em>
						</div>
						{userData.superUser
							? <PupilsList list={pupilsList} getPupils={initializePupils} />
							: <PupilsList list={pupilsList} getPupils={initialiseUserPupils} />
						}
					</Col>
					<Col xs={12} md={8} className="py-4">
						<CollapseComponent
							title="Додати нового учня"
							ariaControls="pupil-add-form-collapse"
						>
							<Suspense
								fallback={
									<LoadingIndicator
										animation="border"
										variant="primary"
									/>}>
								<LazyPupilForm mode="create" />
							</Suspense>
						</CollapseComponent>
					</Col>
				</Row>
			</Col>

		</Container>
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
