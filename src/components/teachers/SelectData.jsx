import React, { useState, useEffect, useCallback } from 'react'

import { Form, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

const SelectData = ({ data, selectBy, setData }) => {

	const [filterFields, setFilterFields] = useState({})
	const [displayData, setDisplayData] = useState([])

	useEffect(() => {
		setData(displayData)
	}, [displayData, setData])

	const createFilter = useCallback(fields => {
		let newFilter = {}
		for (let item of fields) {
			newFilter[item.field] = ''
		}
		setFilterFields({ ...newFilter })
	}, [])

	useEffect(() => {
		createFilter(selectBy)
	// eslint-disable-next-line
	}, [])

	const selectData = ({ id: field, value }) => {
		setFilterFields({ ...filterFields, [field]: value })
	}

	const filterTeachers = useCallback ((filterBy, dataToFilter) => {

		let currentData = dataToFilter //?
		let clearFilter = true

		for (const [field, value] of Object.entries(filterBy)) {
			if (value) {
				currentData = currentData.filter(item => item[field].toString().toUpperCase() === value.toUpperCase())
				setDisplayData([ ...currentData ])
				clearFilter = false
			}
		}
		if (clearFilter) setDisplayData([ ...dataToFilter ])
	}, [])

	useEffect(() => {
		filterTeachers(filterFields, data)
	}, [filterFields, filterTeachers, data])

	return (
		<>
			<Form.Group as={Row}>
				{selectBy.map(item =>
					<Col xs={6} key={item.field} className="mb-2">
						<Form.Control
							size="sm"
							as="select"
							id={item.field}
							onInput={event => selectData(event.target)}>
							<option value="">
								{item.label}
							</option>
							{item.choices.map(choice =>
								<option value={choice} key={item.field + choice}>
									{choice}
								</option>)}
						</Form.Control>
					</Col>
				)}
			</Form.Group>
			<Col xs={12} className="text-muted border1 border-primary px-0">
				<p>
					{Object.keys(filterFields).map(key =>
						<span key={key}>
							{filterFields[key]
								? <>
									<FontAwesomeIcon icon={faAngleRight} className="text-primary" />
									<em> {filterFields[key]} </em>
								</>
								: null}
						</span>
					)}
				</p>
				<p className="pb-2 text-right text-muted1 border1">
					<small>
						<em>
							Total: {displayData.length}
						</em>
					</small>
				</p>
			</Col>
		</>
	)
}

export default SelectData

/*
{filterFields[field]
						? <>
							<em key={field}>{filterFields[field]}</em>
							<FontAwesomeIcon icon={faAngleRight} className="text-primary" />
						</>
						: null
					}
*/
