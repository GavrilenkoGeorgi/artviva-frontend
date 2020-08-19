import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setUserFromLocalStorage } from './reducers/loginReducer'

import Routes from './Routes'

const App = ({ user, setUserFromLocalStorage }) => {
	useEffect(() => {
		if (!user) {
			const loggedUserJSON = window.localStorage.getItem('loggedUserJSON')
			if (loggedUserJSON) {
				const loggedUser = JSON.parse(loggedUserJSON)
				setUserFromLocalStorage(loggedUser)
			}
		} else {
			window.localStorage.setItem(
				'loggedUserJSON', JSON.stringify(user)
			)
		}
	}, [user, setUserFromLocalStorage])

	return (
		<div className="content">
			<Routes />
		</div>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setUserFromLocalStorage
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)
