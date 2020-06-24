import React from 'react'
import PropTypes from 'prop-types'

import { Form, Col } from 'react-bootstrap'

const TextInput = props => {
	const { type, touched, className, ...other } = props
	return (
		<Form.Group
			controlId={`${props.name}-input`}
			as={Col}
			className= {className ? className : 'px-0' }
		>
			<Form.Label>
				{props.label}
				<span className="form-required-mark"> *</span>
			</Form.Label>
			<Form.Control
				// type="text"
				type={type || 'text'}
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

TextInput.propTypes = {
	type: PropTypes.string,
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	onKeyUp: PropTypes.func,
	value: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired
	]),
	touched: PropTypes.bool,
	errors: PropTypes.string
}

const MemodTextInput = React.memo(TextInput)
export default MemodTextInput
