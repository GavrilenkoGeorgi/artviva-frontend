import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment-precise-range-plugin'

import { Col, Form } from 'react-bootstrap'

const ExperienceSort = ({ data: teachers, setData }) => {

	const [xpRange, setXpRange] = useState({
		from: '',
		to: '',
	})

	// returns user with calculated xp
	const calcEmployeeExperience = useCallback (({ id, employmentDate, experienceToDate }) => {
		const today = moment()
		const date = moment(employmentDate)
		const user = {
			id,
			result: {}
		}

		if (date.isBefore(today)) {
			// adjust date, add previous xp
			// to the current employment date
			for (let value in experienceToDate) {
				date.subtract(experienceToDate[value], value)
			}
			const result = moment.preciseDiff(date, today, true)
			return ({ ...user, result })
		} else {
			return ({ ...user, result: experienceToDate })
		}
	}, [])

	const sortByExperienceRange = useCallback (() => {
		const experienceData = []
		// Employment date, plus any other already
		// existing experience, is there is one
		for (let teacher of teachers) {
			const teacherData = calcEmployeeExperience(teacher)
			experienceData.push(teacherData)
		}
		// set the range
		let { from, to } = xpRange
		if (!to || to < 0) to = from

		const teachersResults = experienceData
			.filter(id => id.result.years >= from &&
				id.result.years <= to)

		const ids = teachersResults.map(teacher => teacher.id)

		const teachersToUpdate = teachers
			.filter(teacher => ids
				.includes(teacher.id))

		const updatedTeachers = []

		for (let item of teachersResults) {
			const teacherToUpdate = teachersToUpdate.find(teacher => teacher.id === item.id)
			teacherToUpdate.experience = item.result
			updatedTeachers.push(teacherToUpdate)
		}

		setData([...updatedTeachers])
	}, [teachers, calcEmployeeExperience, xpRange, setData])

	useEffect(() => {
		const allSet = Object.keys(xpRange).every(entry => xpRange[entry] >= 0 )
		if (allSet) {
			sortByExperienceRange()
		} else {
			setData([...teachers])
		}
	}, [xpRange, sortByExperienceRange, setData, teachers])

	return (
		<Form className="my-2 d-flex align-content-center align-items-center justify-content-between">
			<Col xs="2" className="pr-0 text-right">
				<Form.Label className="m-0" htmlFor="xp-from">Стаж</Form.Label>
			</Col>
			<Col xs="4">
				<Form.Control
					id="xp-from"
					onChange={event => setXpRange({ ...xpRange, from: parseInt(event.target.value) })}
					autoComplete="off"
					name="from"
					size="sm"
					type="number"
					placeholder="від"
				/>
			</Col>

			<Col xs="4">
				<Form.Label htmlFor="xp-to" srOnly>до</Form.Label>
				<Form.Control
					id="xp-to"
					onChange={event => setXpRange({ ...xpRange, to: parseInt(event.target.value) })}
					autoComplete="off"
					name="to"
					size="sm"
					type="number"
					placeholder="до"
				/>
			</Col>
			<Col xs="2" className="pl-0">
				років.
			</Col>
		</Form>
	)
}


ExperienceSort.propTypes = {
	data: PropTypes.array.isRequired,
	setData: PropTypes.func.isRequired
}

export default ExperienceSort
