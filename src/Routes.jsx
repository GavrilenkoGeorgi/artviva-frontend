import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ParallaxProvider } from 'react-scroll-parallax'
import './css/index.css'

import SchoolClassesList from './components/schoolClasses/SchoolClassesList'
import SchoolClassDetails from './components/schoolClasses/SchoolClassDetails'
import TeachersList from './components/teachers/TeachersList'
import TeacherDetails from './components/teachers/TeacherDetails'
import PupilsList from './components/pupils/PupilsList'
import SpecialtiesList from './components/specialties/SpecialtiesList'
import BranchesList from './components/branches/BranchesList'
import Payments from './components/payments/Payments'

import { PrivateRoute, Notification, MainPage, Footer } from './components'

import { ScrollToTop, ScrollToTopArrow,
	NavigationBar, SchoolSectionsNav } from './components/navigation'

import { UsersListView, PublicApplyView, AboutView, LoginView,
	RegisterView, BlogView, ContactsView, TeachersView, RecoverView,
	SchoolOverview, PaymentView, ActivateAccountView, PassResetView,
	ShowcaseView, UserProfileView, TeacherGroupsView, TeacherPupilsView } from './components/views'

const Routes = ({ user }) => {

	const [userData, setUserData] = useState({
		id: null,
		superUser: false
	})

	const [superUser, setSuperUser] = useState(false)

	useEffect(() => {
		if (user) {
			setSuperUser(user.superUser)
			setUserData({ id: user.id, superUser: user.superUser })
		}
	}, [user])

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
			<PrivateRoute
				path="/school"
				component={() => <SchoolSectionsNav userData={userData} isSuperUser={superUser}/>}/>
			<PrivateRoute path="/school/users/:id" exact component={UserProfileView} />
			<PrivateRoute path="/school/teachergroups" exact component={TeacherGroupsView} />
			<PrivateRoute path="/school/teacherpupils" exact component={TeacherPupilsView} />
			{superUser
				? <>
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
				</>
				: null
			}
			<Route path="/pay/:status" component={PaymentView} />
			<Route path="/activate/:email/:uuid" exact component={ActivateAccountView} />
			<Route path="/reset/:email/:uuid" exact component={PassResetView} />
			<Footer />
			<ScrollToTopArrow />
		</Router>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect (
	mapStateToProps,
)(Routes)
