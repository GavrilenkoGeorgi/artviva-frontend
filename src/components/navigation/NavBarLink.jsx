import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

const NavBarLink = ({ className, to, label, onClick }) => {
	return (
		<NavLink
			activeclassname="active"
			to={to}
			className={className}
			onClick={onClick}
		>
			{label}
		</NavLink>
	)
}

NavBarLink.propTypes = {
	className: PropTypes.string,
	to: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired
}

export default NavBarLink
