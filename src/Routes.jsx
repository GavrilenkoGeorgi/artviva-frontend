import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './css/index.css'

import GroupDetails from './components/schoolClasses/GroupDetails'
import TeacherDetails from './components/teachers/TeacherDetails'
import BranchesList from './components/branches/BranchesList'
import Payments from './components/payments/Payments'

import { PrivateRoute, Notification, MainPage, Footer } from './components'
import { LoadingIndicator } from './components/common'

import { ScrollToTop, ScrollToTopArrow,
	NavigationBar, SchoolSectionsNav } from './components/navigation'

import { UsersListView, PublicApplyView, AboutView, LoginView,
	RegisterView, BlogView, ContactsView, TeachersView, RecoverView,
	SchoolOverview, PaymentView, ActivateAccountView, PassResetView,
	ShowcaseView, UserProfileView, Specialties, TeacherPaymentsView,
	GroupsView, PupilsView, ListOfTeachers, PricesView } from './components/views'

const Routes = ({ user, fetchingData }) => {

	const [userData, setUserData] = useState({
		id: null,
		superUser: false
	})

	const [superUser, setSuperUser] = useState(false)

	useEffect(() => {
		if (user) {
			const { email, id, name, lastname, superUser } = user
			setSuperUser(superUser)
			setUserData({ email, id, name, lastname, superUser })
		}
	}, [user])

	return (
		<Router>
			<ScrollToTop />
			<NavigationBar />
			<Notification />
			{fetchingData
				? <LoadingIndicator
					animation="border"
					variant="primary"
				/>
				: null }
			<Route path="/" exact component={MainPage} />
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
				component={() => <SchoolSectionsNav userData={userData} />}/>
			<PrivateRoute path="/school/users/:id" exact component={UserProfileView} />
			<PrivateRoute path="/school/teacher/payments" exact component={TeacherPaymentsView} />
			<PrivateRoute path="/school/groups" exact component={GroupsView} />
			<PrivateRoute path="/school/groups/:id" exact component={GroupDetails} />
			<PrivateRoute path="/school/pupils" component={PupilsView} />
			{superUser
				? <>
					<PrivateRoute path="/school/overview" component={SchoolOverview} />
					<Switch>
						<PrivateRoute path="/school/users" exact component={UsersListView} />
						<PrivateRoute path="/school/teachers/:id" exact component={TeacherDetails} />
						<PrivateRoute path="/school/teachers" component={ListOfTeachers} />
					</Switch>
					<PrivateRoute path="/school/specialties" component={Specialties} />
					<PrivateRoute path="/school/branches" component={BranchesList} />
					<PrivateRoute path="/school/payments" component={Payments} />
				</>
				: null
			}
			<Route path="/prices" exact component={PricesView} />
			<Route path="/pay/:status" exact component={PaymentView} />
			<Route path="/activate/:email/:uuid" exact component={ActivateAccountView} />
			<Route path="/reset/:email/:uuid" exact component={PassResetView} />
			<Footer />
			<ScrollToTopArrow />
		</Router>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		fetchingData: state.notification.fetchingData
	}
}

export default connect (
	mapStateToProps,
)(Routes)
