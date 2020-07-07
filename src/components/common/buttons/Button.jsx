import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const ButtonComponent = ({ label, dataCy, ...props }) => {
	return (
		<Button
			data-cy={dataCy}
			{...props}
		>
			{label}
		</Button>
	)
}

ButtonComponent.propTypes = {
	label: PropTypes.string.isRequired,
	dataCy: PropTypes.string.isRequired,
	props: PropTypes.shape({
		onClick: PropTypes.func,
		className: PropTypes.string,
		variant: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		block: PropTypes.bool,
		disabled: PropTypes.bool
	})
}

export default ButtonComponent
