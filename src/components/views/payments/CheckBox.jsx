import React from 'react'
import { Form } from 'react-bootstrap'

const CheckBox = (props) => {
	return <Form>
		<Form.Check
			custom
			type="checkbox"
			id="custom-checkbox"
			label={props.label}
			checked={props.checked}
			onChange={props.onChange}
		/>
	</Form>
}

const MemodCheckBox = React.memo(CheckBox)
export default MemodCheckBox
