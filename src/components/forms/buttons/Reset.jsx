import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

const Reset = ({ dataCy, ...props }) => {
	return (
		<Button
			type="reset"
			data-cy={dataCy}
			{ ...props }
		>
			{props.label}
		</Button>
	)
}

Reset.propTypes = {
	label: PropTypes.string.isRequired,
	dataCy: PropTypes.string.isRequired,
	className: PropTypes.string,
	variant: PropTypes.string,
	onClick: PropTypes.func,
}

const MemodReset = React.memo(Reset)
export default MemodReset
