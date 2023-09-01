import React from 'react'
import PropTypes from 'prop-types'

import { Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import styles from './TextInput.module.sass'

const TextAreaInput = props => {
	const {
		touched,
		infoBtn,
		showInfo,
		...other } = props

	return (
		<Form.Group
			controlId={`${props.name}-input`}
		>
			<Form.Label className={styles.inputLabel}>
				{props.label}
				{infoBtn
					? <FontAwesomeIcon
						icon={faQuestionCircle}
						onClick={showInfo}
						className="ml-2 text-primary"/>
					: null}
			</Form.Label>
			<Form.Control
				as="textarea"
				type="textarea"
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

TextAreaInput.propTypes = {
	label: PropTypes.string.isRequired,
	infoBtn: PropTypes.bool,
	showInfo: PropTypes.func,
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
