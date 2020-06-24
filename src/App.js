import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'
import { loadReCaptcha } from 'react-recaptcha-google'
import { setUserFromLocalStorage } from './reducers/loginReducer'

import PrivateRoute from './components/PrivateRoute'
import ScrollToTop from './components/navigation/ScrollToTop'

import Notification from './components/Notification'
import NavigationBar from './components/navigation/NavigationBar'
import Footer from './components/Footer'
import MainPage from './components/MainPage'
import AboutView from './components/views/AboutView'
import LoginView from './components/views/LoginView'
import RegisterView from './components/views/RegisterView'
import BlogView from './components/views/BlogView'
import ContactsView from './components/views/ContactsView'
import TeachersView from './components/views/TeachersView'
import RecoverView from './components/views/RecoverView'
import SchoolOverview from './components/views/SchoolOverview'
import SchoolClassesList from './components/schoolClasses/SchoolClassesList'
import SchoolClassDetails from './components/schoolClasses/SchoolClassDetails'
import TeachersList from './components/teachers/TeachersList'
import TeacherDetails from './components/teachers/TeacherDetails'
import PupilsList from './components/pupils/PupilsList'
import SpecialtiesList from './components/specialties/SpecialtiesList'
import BranchesList from './components/branches/BranchesList'
import Payments from './components/payments/Payments'
import PaymentView from './components/views/PaymentView'
import ActivateAccountView from './components/views/ActivateAccountView'
import PassResetView from './components/views/PassResetView'
import ScrollToTopArrow from './components/common/ScrollToTopArrow'
import SchoolSectionsNav from './components/navigation/SchoolSectionsNav'
import ShowcaseView from './components/views/ShowcaseView'

import { UsersListView, PublicApplyView } from './components'
import './css/index.css'

const App = (props) => {
	useEffect(() => {
		if (!props.user) {
			const loggedUserJSON = window.localStorage.getItem('loggedUserJSON')
			if (loggedUserJSON) {
				const loggedUser = JSON.parse(loggedUserJSON)
				props.setUserFromLocalStorage(loggedUser)
			}
		} else {
			window.localStorage.setItem(
				'loggedUserJSON', JSON.stringify(props.user)
			)
		}
	}, [props, props.user, props.setUserFromLocalStorage])

	useEffect(() => {
		loadReCaptcha()
	}, [])

	return (
		<Router>
			<ScrollToTop />
			<NavigationBar />
			<Notification />
			<ParallaxProvider>
				<Route path="/" exact component={MainPage} />
			</ParallaxProvider>
			<Route path="/about" component={AboutView} />
			<Route path="/showcase" component={ShowcaseView} />
			<Route path="/teachers/:department?" component={TeachersView} />
			<Route path="/login" component={LoginView} />
			<Route path="/recover" component={RecoverView} />
			<Route path="/register" component={RegisterView} />
			<Route path="/blog" component={BlogView} />
			<Route path="/contacts" component={ContactsView} />
			<Route path="/apply/:status?" component={PublicApplyView} />
			<PrivateRoute path="/school" component={SchoolSectionsNav} />
			{/* How is this different? */}
			{/*<Route
				path="/test"
				render={({ match: { url } }) => (
					<>
						<PrivateRoute path={`${url}/`} component={Test} exact />
						<PrivateRoute path={`${url}/userslist`} component={UsersList}/>
						<PrivateRoute path={`${url}/other`} component={SomeOtherComponent}/>
					</>
				)}
			/>*/}
			<PrivateRoute path="/school/overview" component={SchoolOverview} />
			<Switch>
				{/*<PrivateRoute path="/school/users/:id" exact component={SchoolClassDetails} />*/}
				<PrivateRoute path="/school/users" exact component={UsersListView} />
				<PrivateRoute path="/school/classes/:id" exact component={SchoolClassDetails} />
				<PrivateRoute path="/school/classes" component={SchoolClassesList} />
				<PrivateRoute path="/school/teachers/:id" exact component={TeacherDetails} />
				<PrivateRoute path="/school/teachers" component={TeachersList} />
			</Switch>
			<PrivateRoute path="/school/pupils" component={PupilsList} />
			<PrivateRoute path="/school/specialties" component={SpecialtiesList} />
			<PrivateRoute path="/school/branches" component={BranchesList} />
			<PrivateRoute path="/school/payments" component={Payments} />
			<Route path="/pay/:status" component={PaymentView} />
			<Route path="/activate/:email/:uuid" exact component={ActivateAccountView} />
			<Route path="/reset/:email/:uuid" exact component={PassResetView} />
			<Footer />
			<ScrollToTopArrow />
		</Router>
	)
}

const mapStateToProps = (state) => {
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
