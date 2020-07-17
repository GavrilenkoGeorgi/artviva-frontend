import React from 'react'
import PropTypes from 'prop-types'

import { Form, Col } from 'react-bootstrap'

const DateInput = props => {
	const { touched, ...other } = props

	return (
		<Form.Group
			controlId={`${props.name}-input`}
			as={Col}
			xs={12}
		>
			<Form.Label>
				{props.label}
				{props.required === false
					? null
					: <span className="form-required-mark"> *</span>}
			</Form.Label>
			<Form.Control
				type="date"
				isValid={touched && !props.errors}
				isInvalid={touched && !!props.errors}
				{ ...other }
			/>
			<Form.Control.Feedback type="invalid">
				{props.errors}
			</Form.Control.Feedback>
		</Form.Group>
	)
}

DateInput.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	touched: PropTypes.bool,
	errors: PropTypes.string
}

const MemodDateInput = React.memo(DateInput)
export default MemodDateInput
