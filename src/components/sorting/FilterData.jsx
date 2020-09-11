import React from 'react'
import PropTypes from 'prop-types'

import { Form, Col } from 'react-bootstrap'
import SortControlColumn from './SortControlColumn'

const FilterData = ({ filter, fieldName, placeholder, size }) => {

	return (
		<SortControlColumn size={size}>
			<Form.Label htmlFor={`${fieldName}-filter-input`} srOnly>
				<Col xs={12} className="px-0">
					{placeholder}
				</Col>
			</Form.Label>

			<Col xs={12} className="px-0">
				<Form.Control
					onChange={event => filter(event)}
					id={`${fieldName}-filter-input`}
					autoComplete="off"
					name={fieldName}
					size="sm"
					type="text"
					placeholder={placeholder}
				/>
			</Col>
		</SortControlColumn>
	)
}

FilterData.propTypes = {
	fieldName: PropTypes.string.isRequired,
	placeholder: PropTypes.string.isRequired
}

export default FilterData
