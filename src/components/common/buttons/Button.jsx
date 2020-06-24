import React from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const ButtonComponent = ({ className, variant, type, handleClick, label, block, disabled }) => {
	return (
		<Button
			block={block}
			className={className}
			variant={variant}
			type={type}
			onClick={handleClick}
			disabled={disabled}
		>
			{label}
		</Button>
	)
}

ButtonComponent.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	handleClick: PropTypes.func,
	label: PropTypes.string.isRequired,
	block: PropTypes.bool,
	disabled: PropTypes.bool
}

export default ButtonComponent
