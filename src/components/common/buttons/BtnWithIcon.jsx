import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faInfo } from '@fortawesome/free-solid-svg-icons'

const BtnWithIcon = props => {

	const { label, icon, className, ...other } = props
	const chooseIcon = () => {
		if (icon === 'trash') return <FontAwesomeIcon icon={faTrash} />
		if (icon === 'edit') return <FontAwesomeIcon icon={faEdit} />
		if (icon === 'info') return <FontAwesomeIcon icon={faInfo} />
	}

	return (
		<Button
			{ ...other }
			className={`${className} ml-2 py-1 btn-with-icon`}
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
