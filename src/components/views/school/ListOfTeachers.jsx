import React, { useEffect, useState, useCallback, Suspense } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Helmet } from 'react-helmet'

import { Form, ListGroup, Container, Row, Col } from 'react-bootstrap'
import { initializeTeachers, setTeacherExp } from '../../../reducers/teachersReducer'
import { initializeSpecialties } from '../../../reducers/specialtiesReducer'
import { setNotification, setFetchingData } from '../../../reducers/notificationReducer'
import { removeFalsyProps, pureObjectIsEmpty } from '../../../utils/objectHelpers'
import { multiPropsFilter, boolPropsFilter } from '../../../utils/arrayHelpers'
import { calcEmployeeExperience } from '../../../utils/datesAndTime'

import teacherFields from '../../../data/forms/teacherFields.json'
import { Teacher, AddTeacher } from '../../teachers'
import { ShowFilterSettings, FilterData, ExperienceSort,
	SelectFields, FilterBooleanFields, AgeFilter } from '../../sorting'
import Reset from '../../forms/buttons/Reset'
import { Button } from '../../common/buttons'
import { LoadingIndicator } from '../../common'
import CommonLayout from '../../CommonLayout'
import { CollapseComponent } from '../../common'

const LazyEntityEditModal = React.lazy(() => import('../../common/EntityEditModal'))

const ListOfTeachers = ({ teachers,
	initializeTeachers,
	initializeSpecialties,
	setTeacherExp,
	setNotification,
	setFetchingData }) => {

	const { filter, select, boolean, range } = teacherFields

	const [teacherList, setTeacherList] = useState([])
	const [filterSettings, setFilterSettings] = useState({})
	const [addModalShow, setAddModalShow] = useState(false)

	useEffect(() => {
		setFetchingData(true)
		initializeSpecialties()
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
		// promise all ?
		initializeTeachers()
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setFetchingData(false))
	}, [initializeTeachers, setNotification, initializeSpecialties, setFetchingData])

	const calcExperience = useCallback(teachersData => {
		const experienceData = []
		const updatedTeachers = []
		// Employment date, plus any other already
		// existing experience, if there is one
		for (let teacher of teachersData) {
			const teacherList = calcEmployeeExperience(teacher)
			experienceData.push(teacherList)
		}

		for (let item of experienceData) {
			const teacherToUpdate = teachersData.find(teacher => teacher.id === item.id)
			teacherToUpdate.experience = item.result
			updatedTeachers.push(teacherToUpdate)
		}
		setTeacherExp(updatedTeachers)
	}, [setTeacherExp])

	useEffect(() => {
		if (teachers) {
			setTeacherList(teachers)
			calcExperience(teachers)
		}
	}, [teachers, calcExperience])

	const sortByExperienceRange = useCallback((range, data) => {

		const from = parseInt(range.from)
		let to = parseInt(range.to)

		if (from > to) {
			// max i guess
			to = 99
		}

		return data.filter(item => item.experience.years >= from &&
			item.experience.years <= to)
	}, [])

	const sortByAge = useCallback((age, data) => {

		const from = parseInt(age.ageFrom)
		const to = parseInt(age.ageTo) || 99

		return data.filter(item => {
			const age = moment().diff(item.dateOfBirth, 'years')
			return age >= from && age <= to
		})
	}, [])

	const changeFilterSetting = (event) => {
		event.preventDefault()
		const { target } = event
		const { name: field, value } = target
		switch (field) {
		case 'name': {
			if (value) {
				setFilterSettings({ ...filterSettings, [field]: value })
			}
			else {
				setFilterSettings({ name: '' })
			}
			break
		}
		case 'ageFrom':
		case 'ageTo':
		case 'from':
		case 'to': {
			setFilterSettings({ ...filterSettings, [field]: value || 0 })
			break
		}
		case 'isRetired':
		case 'employeeIsAStudent': {
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
		}
		}
	}

	const selectData = useCallback((arrayOfStuff) => {
		// eslint-disable-next-line
		const { name, ageFrom, ageTo, from, to, ...filterData } = filterSettings
		return multiPropsFilter(arrayOfStuff, filterData)
	}, [filterSettings])

	const sortData = useCallback((settings) => {
		let result = teachers
		if (settings) {
			const { name, ageFrom, ageTo, from, to, isRetired, employeeIsAStudent } = settings

			if (name && name.length > 0) {
				result = result.filter(item => item.name.toUpperCase().includes(settings.name.toUpperCase()))
			}

			if (from || to) {
				const range = {
					from: from || 0,
					to: to || 0
				}
				result = sortByExperienceRange(range, result)
			}

			if (ageFrom || ageTo) {
				const age = {
					ageFrom: ageFrom || 0,
					ageTo: ageTo || 0
				}
				result = sortByAge(age, result)
			}

			const boolFilter =
			(typeof isRetired === 'boolean' && typeof employeeIsAStudent === 'boolean')
				? { isRetired, employeeIsAStudent } :
				(typeof isRetired === 'boolean') ? { isRetired } :
					(typeof employeeIsAStudent === 'boolean') ? { employeeIsAStudent } : false

			if (boolFilter) {
				result = boolPropsFilter(result, boolFilter)
			}

			setTeacherList([ ...selectData(result) ])
		} else {
			setTeacherList([ ...teachers ])
		}
	}, [sortByExperienceRange, sortByAge, selectData, teachers])

	useEffect(() => {
		if (pureObjectIsEmpty(removeFalsyProps(filterSettings))) {
			sortData(null)
		} else {
			sortData(filterSettings)
		}
	}, [filterSettings, sortData, teachers])

	return <>
		<Helmet>
			<title>Активація аккаунта</title>
			<meta name="description" content="Активація аккаунта нових користувачів."/>
		</Helmet>
		<CommonLayout>
			<Container>
				<Row className="d-flex align-items-center">
					<Col xs={12}>
						<h4 className="custom-font text-center">
							Список усіх вчителів школи
						</h4>
					</Col>
					<Col xs={12} className="pb-3">
						<section className="p-3 school-explained custom-font-small">
							<p>
								Наприклад: щоб дізнатись, скільки вчителів зараз на пенсії та мешкає у селі,{' '}
								виберіть фільтр «На пенсії» та «Проживання: Село».
							</p>
							<p>
								Щоб додати нового вчителя, заповніть форму натиснув кнопку нижче.
							</p>
						</section>
					</Col>

					<Col className="px-0">
						<Form onReset={() => setFilterSettings({})}>

							<Col xs={12} className="px-0">
								{/* Filter by name chars */}
								<FilterData
									filter={changeFilterSetting}
									fieldName="name"
									placeholder="Прізвище вчителя"
								/>
							</Col>

							<Col xs={12} className="pt-2">
								<CollapseComponent
									title="Більше фільтрів"
									ariaControls="specialty-add-form-collapse"
								>
									<>
										<Row>
											<AgeFilter
												filter={changeFilterSetting}
												values={filterSettings}
											/>
											{/* Select by experience range */}
											<ExperienceSort
												filter={changeFilterSetting}
											/>
										</Row>

										{/* Select by boolean fields */}
										<Col xs={12} className="my-2">
											<FilterBooleanFields
												selectBy={boolean}
												filter={changeFilterSetting}
											/>
										</Col>

										{/* Select by field */}
										<Col xs={12} className="py-2 mb-3">
											<SelectFields
												selectBy={select}
												filter={changeFilterSetting}
											/>
										</Col>
									</>
								</CollapseComponent>
							</Col>

							{/* Buttons */}
							<Col xs={12} className="my-3">
								<Row>
									<Col xs={6}>
										<Button
											block
											dataCy="add-new-pupil"
											label="Додати нового"
											onClick={() => setAddModalShow(true)}
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
					</Col>
					{/* Current filter settings display */}
					<Col xs={12}>
						<ShowFilterSettings
							labels={[ ...filter, ...select, ...boolean, ...range ]}
							settings={filterSettings}
						/>
					</Col>
					<Col xs={12}>
						<p className="pb-2 text-right text-muted">
							<small>
								<em>
									Загалом: {teacherList.length}
								</em>
							</small>
						</p>
					</Col>
					{/* Filtered list of teachers */}
					<Col xs={12}>
						<ListGroup>
							{teacherList.map((teacher, index) =>
								<ListGroup.Item
									className="px-0 py-1"
									key={teacher.id}
								>
									<Teacher
										teacher={teacher}
										number={index + 1}
									/>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Col>
					<Suspense fallback={
						<LoadingIndicator
							animation="border"
							variant="primary"
							size="md"
						/>}>
						<LazyEntityEditModal
							subject="Додати нового вчителя"
							show={addModalShow}
							onHide={() => setAddModalShow(false)}
						>
							<AddTeacher showModal={setAddModalShow} />
						</LazyEntityEditModal>
					</Suspense>
				</Row>
			</Container>
		</CommonLayout>
	</>
}

const mapStateToProps = state => {
	return {
		teachers: state.teachers,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	initializeTeachers,
	initializeSpecialties,
	setNotification,
	setTeacherExp,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListOfTeachers)
