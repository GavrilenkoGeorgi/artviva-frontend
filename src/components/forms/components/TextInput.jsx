import React from 'react'
import PropTypes from 'prop-types'

import { Form, Col } from 'react-bootstrap'
import styles from './TextInput.module.sass'

const TextInput = props => {
	const {
		dataCy,
		type,
		touched,
		className,
		...other } = props
	return (
		<Form.Group
			controlId={`${props.name}-input`}
			as={Col}
			className= {className ? className : 'px-0' }
		>
			<Form.Label className={styles.inputLabel}>
				{props.label}
				{props.required === false
					? null
					: <span className="form-required-mark"> *</span>}
			</Form.Label>
			<Form.Control
				data-cy={dataCy}
				type={type || 'text'}
				isValid={touched && !props.errors}
				isInvalid={touched && !!props.errors}
				{ ...other }
			/>
			<Form.Control.Feedback type="invalid" className={styles.formFeedback}>
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
	onBlur: PropTypes.func,
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
