import React from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

const ButtonLink = ({ label, route, ...props }) => {
	return (
		<Button
			{...props}
			href={route}
		>
			{label}
		</Button>
	)
}

ButtonLink.propTypes = {
	label: PropTypes.string.isRequired,
	route: PropTypes.string.isRequired
}

export default ButtonLink
