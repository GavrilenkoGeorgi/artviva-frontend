import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setUserFromLocalStorage } from './reducers/loginReducer'
import { initializeSpecialties } from './reducers/specialtiesReducer'
import Routes from './Routes'
import ReactGA from 'react-ga'

import UserDataContext from './context/UserDataContext'

ReactGA.initialize(process.env.REACT_APP_TRACKING_ID)

const App = ({ user, setUserFromLocalStorage, initializeSpecialties }) => {

	useEffect(() => {
		initializeSpecialties()
	}, [initializeSpecialties])

	useEffect(() => {
		ReactGA.pageview(window.location.pathname + window.location.search)
		console.log('GA page view')
	}, [])

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
		<UserDataContext.Provider value={user}>
			<Routes />
		</UserDataContext.Provider>
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
