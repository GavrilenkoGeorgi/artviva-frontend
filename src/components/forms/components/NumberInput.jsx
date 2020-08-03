import React from 'react'
import PropTypes from 'prop-types'

import { Form, Col } from 'react-bootstrap'

const NumberInput = props => {
	const {
		dataCy,
		touched,
		className,
		...other } = props
	return (
		<Form.Group
			controlId={`${props.name}-input`}
			as={Col}
			className= {className ? className : 'px-0' }
		>
			<Form.Label>
				{props.label}
				{props.required === false
					? null
					: <span className="form-required-mark"> *</span>}
			</Form.Label>
			<Form.Control
				data-cy={dataCy}
				type="Number"
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

NumberInput.propTypes = {
	type: PropTypes.string,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func,
	onKeyUp: PropTypes.func,
	value: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired
	]),
	touched: PropTypes.bool,
	errors: PropTypes.string
}

export default NumberInput
