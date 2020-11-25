import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { Form, Col, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const PasswordInput = props => {
	const {
		dataCy,
		touched,
		className,
		...other } = props

	// password visibility
	const [passHidden, setPassVis] = useState(false)

	const togglePassVis = () => {
		setPassVis(!passHidden)
		let passInput = document.getElementById(`${props.name}-input`)
		if (passHidden) {
			passInput.type = 'password'
		} else {
			passInput.type = 'text'
		}
	}

	return (
		<Form.Group
			as={Col}
			className= {className ? className : 'px-0' }
		>
			<Form.Label
				aria-labelledby={`${props.name}-input`}
				htmlFor={`${props.name}-input`}
			>
				{props.label}
				{props.required === false
					? null
					: <span className="form-required-mark"> *</span>}
			</Form.Label>
			<InputGroup>
				<Form.Control
					id={`${props.name}-input`}
					data-cy={dataCy}
					type="password"
					isValid={touched && !props.errors}
					isInvalid={touched && !!props.errors}
					{ ...other }
				/>
				<InputGroup.Append>
					<Button
						variant="outline-secondary border rounded-right"
						onClick={() => togglePassVis()}
						data-cy="pass-vis-toggler"
					>
						{passHidden
							? <FontAwesomeIcon icon={faEyeSlash} />
							: <FontAwesomeIcon icon={faEye} />
						}
					</Button>
				</InputGroup.Append>
				<Form.Control.Feedback type="invalid">
					{props.errors}
				</Form.Control.Feedback>
			</InputGroup>
		</Form.Group>
	)
}

PasswordInput.propTypes = {
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

const MemodPasswordInput = React.memo(PasswordInput)
export default MemodPasswordInput
