import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const BtnWithIcon = ({ className, variant, type, handleClick, label, block, disabled, icon }) => {

	const chooseIcon = () => {
		if (icon === 'trash') return <FontAwesomeIcon icon={faTrash} />
	}

	return (
		<Button
			block={block}
			className={className}
			variant={variant}
			type={type}
			onClick={handleClick}
			disabled={disabled}
		>
			{chooseIcon() || label}
		</Button>
	)
}

BtnWithIcon.propTypes = {
	className: PropTypes.string,
	variant: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	handleClick: PropTypes.func,
	label: PropTypes.string.isRequired,
	block: PropTypes.bool,
	disabled: PropTypes.bool,
	iocn: PropTypes.string
}

export default BtnWithIcon
