import React from 'react'
import { connect } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'
import authService from '../services/authService'

// eslint-disable-next-line
const PrivateRoute = ({ user, component: Component, ...rest }) => { // remove user!

	const isLoggedInMK1 = authService.isLoggedIn()

	return (
		<Route
			{...rest}
			render={props =>
				isLoggedInMK1 ? (
					<Component {...props} />
				) : (
					<Redirect to={{ pathname: '/login', state: { from: props.location } }} />
				)
			}
		/>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect (
	mapStateToProps,
)(PrivateRoute)
