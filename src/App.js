import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setUserFromLocalStorage } from './reducers/loginReducer'
import { initializeSpecialties } from './reducers/specialtiesReducer'
import Routes from './Routes'

const App = ({ user, setUserFromLocalStorage, initializeSpecialties }) => {

	useEffect(() => {
		initializeSpecialties()
	}, [initializeSpecialties])

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

	// div responsible for sticky footer, looks ugly
	return <div className="content">
		<Routes />
	</div>
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setUserFromLocalStorage,
	initializeSpecialties // needed everywhere
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App)
