import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'

const FilterData = ({ filter, fieldName, placeholder }) => {

	return (
		<Form>
			<Form.Label htmlFor={`${fieldName}-filter-input`} srOnly>
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
	fieldName: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired
}

export default FilterData
