import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'

import { ListGroup, Container, Row, Col } from 'react-bootstrap'
import { initializeTeachers, setTeacherExp } from '../../reducers/teachersReducer'
import { setNotification } from '../../reducers/notificationReducer'
import { removeFalsyProps, pureObjectIsEmpty } from '../../utils/objectHelpers'
import { multiPropsFilter, boolPropsFilter } from '../../utils/arrayHelpers'
import { calcEmployeeExperience } from '../../utils/datesAndTime'

import { teacherSelectFields, teacherBoolFields } from '../../data/forms/teacherFields.json'
import { Teacher, AddTeacher } from '../teachers'
import { FilterDisplay, FilterData, ExperienceSort, SelectFields, FilterBooleanFields } from '../sorting'

const ListOfTeachers = ({ teachers, initializeTeachers, setTeacherExp, setNotification }) => {
	// better move this somewhere
	const [teacherData, setTeacherData] = useState([])
	const [filterSettings, setFilterSettings] = useState({})
	const [currentlyActiveFilter, setCurrentlyActiveFilter] = useState('')

	useEffect(() => {
		initializeTeachers()
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
	}, [initializeTeachers, setNotification])

	const calcExperience = useCallback(teachersData => {
		const experienceData = []
		const updatedTeachers = []
		// Employment date, plus any other already
		// existing experience, if there is one
		for (let teacher of teachersData) {
			const teacherData = calcEmployeeExperience(teacher)
			experienceData.push(teacherData)
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
			setTeacherData(teachers)
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
			setCurrentlyActiveFilter('name')
			break
		}
		case 'from':
		case 'to': {
			setFilterSettings({ ...filterSettings, [field]: value || 0 })
			setCurrentlyActiveFilter('range')
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
			setCurrentlyActiveFilter('booleans')
			break
		}
		default: {
			setCurrentlyActiveFilter('select')
			setFilterSettings({ ...filterSettings, [field]: value })
		}
		}
	}

	const selectData = useCallback((arrayOfStuff) => {
		// eslint-disable-next-line
		const { name, from, to, ...filterData } = filterSettings
		return multiPropsFilter(arrayOfStuff, filterData)
	}, [filterSettings])

	const sortData = useCallback((settings) => {
		let result = teachers
		if (settings) {
			const { name, from, to, isRetired, employeeIsAStudent } = settings

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

			const boolFilter =
			(typeof isRetired === 'boolean' && typeof employeeIsAStudent === 'boolean')
				? { isRetired, employeeIsAStudent } :
				(typeof isRetired === 'boolean') ? { isRetired } :
					(typeof employeeIsAStudent === 'boolean') ? { employeeIsAStudent } : false


			if (boolFilter) {
				result = boolPropsFilter(result, boolFilter)
			}

			setTeacherData([ ...selectData(result) ])

		} else {
			setTeacherData([ ...teachers ])
		}
	}, [sortByExperienceRange, selectData, teachers])

	useEffect(() => {
		if (pureObjectIsEmpty(removeFalsyProps(filterSettings))) {
			sortData(null)
		} else {
			sortData(filterSettings)
		}
	}, [filterSettings, sortData, teachers])

	return (
		<Container>
			<Row className="d-flex align-items-center">
				<Col xs={12} className="border1 border-warning">
					<h4 className="py-3 custom-font text-center">
						Список усіх вчителів школи
					</h4>
				</Col>
				{/* Select by field */}
				<Col xs={12} className="py-2 border1 rounded mb-3">
					<SelectFields
						selectBy={teacherSelectFields}
						filter={changeFilterSetting}
					/>
				</Col>
				{/* Filter by name chars */}
				<Col xs={12} sm={6} className="my-2">
					<FilterData
						filter={changeFilterSetting}
						fieldName="name"
						placeholder="Прізвище вчителя"
					/>
				</Col>
				{/* Select by experience range */}
				<Col xs={12} sm={6} className="my-2">
					<ExperienceSort
						filter={changeFilterSetting}
					/>
				</Col>
				{/* Select by boolean fields */}
				<Col xs={12} sm={6} className="my-2">
					<FilterBooleanFields
						selectBy={teacherBoolFields}
						filter={changeFilterSetting}
					/>
				</Col>
				{/* Current filter settings display */}
				<Col xs={12}>
					<FilterDisplay
						settings={filterSettings}
						currentFilter={currentlyActiveFilter}
					/>
				</Col>
				<Col xs={12}>
					<p className="pb-2 text-right text-muted">
						<small>
							<em>
								Загалом: {teacherData.length}
							</em>
						</small>
					</p>
				</Col>
				{/* Filtered list of teachers */}
				<Col xs={12}>
					<ListGroup>
						{teacherData.map((teacher, index) =>
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
				{/* Add new teacher form */}
				<Col>
					<AddTeacher />
				</Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		teachers: state.teachers
	}
}

const mapDispatchToProps = {
	initializeTeachers,
	setNotification,
	setTeacherExp
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListOfTeachers)
