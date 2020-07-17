import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'

const FilterData = ({ data, setData, fieldName, placeholder }) => {

	const filter = ({ target }) => {
		const { name: field, value } = target
		const result = data.filter(item => item[field].toUpperCase().includes(value.toUpperCase()))
		setData([...result])
	}

	return (
		<Form className="border1 border-danger justify-content-center">
			<Form.Label htmlFor="xp-to" srOnly>
				{placeholder}
			</Form.Label>
			<Form.Control
				onChange={event => filter(event)}
				id={`${fieldName}-filter-input`}
				autoComplete="off"
				name={fieldName}
				size="sm"
				type="text"
				placeholder={placeholder}
			/>
		</Form>
	)
}

FilterData.propTypes = {
	data: PropTypes.array.isRequired,
	setData: PropTypes.func.isRequired,
	fieldName: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired
}

export default FilterData
