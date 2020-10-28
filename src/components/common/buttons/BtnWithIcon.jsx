import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faInfo } from '@fortawesome/free-solid-svg-icons'

import { SimpleSpinner } from '../spinners'

const BtnWithIcon = props => {

	const { dataCy, label, icon, className, loading, ...other } = props
	const chooseIcon = () => {
		if (icon === 'trash') return <FontAwesomeIcon icon={faTrash} />
		if (icon === 'edit') return <FontAwesomeIcon icon={faEdit} />
		if (icon === 'info') return <FontAwesomeIcon icon={faInfo} />
	}

	return (
		<Button
			{ ...other }
			data-cy={dataCy}
			className={`${className} ml-2 py-2 btn-with-icon d-flex align-items-center justify-content-center`}
		>
			{loading
				? <SimpleSpinner size="sm" variant="success"/>
				: <>{chooseIcon() || label}</>
			}
		</Button>
	)
}

BtnWithIcon.propTypes = {
	dataCy: PropTypes.string,
	className: PropTypes.string,
	variant: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	handleClick: PropTypes.func, //?
	label: PropTypes.string.isRequired,
	block: PropTypes.bool,
	disabled: PropTypes.bool,
	loading: PropTypes.bool,
	icon: PropTypes.string
}

export default BtnWithIcon
