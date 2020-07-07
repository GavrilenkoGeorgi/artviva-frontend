import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'

const TextAreaInput = props => {
	const { touched, ...other } = props

	return (
		<Form.Group
			controlId={`${props.name}-input`}
		>
			<Form.Label>
				{props.label}
			</Form.Label>
			<Form.Control
				as="textarea"
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

TextAreaInput.propTypes = {
	label: PropTypes.string.isRequired,
	rows: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	value: PropTypes.string.isRequired,
	touched: PropTypes.bool,
	errors: PropTypes.string
}

const MemodTextAreaInput = React.memo(TextAreaInput)
export default MemodTextAreaInput
