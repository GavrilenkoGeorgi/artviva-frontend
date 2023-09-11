import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setUserFromLocalStorage } from './reducers/loginReducer'
import { initializeSpecialties } from './reducers/specialtiesReducer'
import Routes from './Routes'
import GA4React from 'ga-4-react'

import UserDataContext from './context/UserDataContext'

try {
	setTimeout(() => {
		const ga4react = new GA4React(process.env.REACT_APP_TRACKING_ID)
		ga4react.initialize().catch(err => console.error(err))
	}, 4000)
} catch (err) {
	console.error(err)
}

const App = ({ user, setUserFromLocalStorage, initializeSpecialties }) => {

	useEffect(() => {
		initializeSpecialties()
	}, [initializeSpecialties])

	/* useEffect(() => {
		ga4react.send({ hitType: 'pageview', page: window.location.pathname + window.location.search })
		console.log('GA page view')
	}, []) */

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
	return <main className="content">
		<UserDataContext.Provider value={user}>
			<Routes />
		</UserDataContext.Provider>
	</main>
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
