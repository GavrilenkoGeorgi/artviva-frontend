import React from 'react'
import PropTypes from 'prop-types'

import { Form, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

const Select = props => {
	const {
		touched,
		placeholder,
		infoBtn,
		showInfo,
		...other } = props

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
				{infoBtn
					? <FontAwesomeIcon
						icon={faQuestionCircle}
						onClick={showInfo}
						className="ml-2 text-primary"/>
					: null}
			</Form.Label>
			<Form.Control
				as="select"
				custom
				{ ...other }
				isValid={touched && !props.errors}
				isInvalid={touched && !!props.errors}
			>
				<option value={0}>{placeholder || 'Виберіть...'}</option>
				{props.options.map(item =>
					<option value={item} key={item}>{item}</option>
				)}
			</Form.Control>
			<Form.Control.Feedback type="invalid">
				{props.errors}
			</Form.Control.Feedback>
		</Form.Group>
	)
}

Select.propTypes = {
	label: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	infoBtn: PropTypes.bool,
	showInfo: PropTypes.func,
	name: PropTypes.string.isRequired,
	options: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	value: PropTypes.oneOfType([
		PropTypes.string.isRequired,
		PropTypes.number.isRequired
	]),
	touched: PropTypes.bool,
	errors: PropTypes.string
}

const MemodSelect = React.memo(Select)
export default MemodSelect
