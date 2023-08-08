import React from 'react'
import { connect } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import GroupDetails from './components/schoolClasses/GroupDetails'
import TeacherDetails from './components/teachers/TeacherDetails'
import LiqPayPayments from './components/views/payments/LiqPayPayments'

import { PrivateRoute, Notification } from './components'
import { LoadingIndicator, FourZeroFour } from './components/common'
import { PupilDetails, PupilFormF1 } from './components/pupils'

import { ScrollToTop, ScrollToTopArrow,
	NavigationBar, SchoolSectionsNav } from './components/navigation'

import { UsersListView, PublicApplyView, AboutView, LoginView,
	RegisterView, BlogView, ContactsView, TeachersView, RecoverView,
	SchoolOverview, ActivateAccountView, PassResetView,
	ShowcaseView, UserProfileView, Specialties, TeacherPaymentsView,
	GroupsView, PupilsView, ListOfTeachers, PricesView, MainPage, PaymentView } from './components/views'

import Oferta from './components/views/legal/Oferta'
import LegalDocs from './components/views/legal/LegalDocs'
import PrivacyPolicy from './components/views/legal/PrivacyPolicy'
import SchoolExplained from './components/help/SchoolExplained'
import SpecialtyDetails from './components/specialties/SpecialtyDetails'
import Banner from './components/announcements/Banner'

export const history = createBrowserHistory({ forceRefresh: true })

const Routes = ({ fetchingData }) => {
	return <Router history={history}>
		<ScrollToTop />
		<NavigationBar />
		<Banner />
		<SchoolSectionsNav />
		<Notification />
		{fetchingData &&
			<LoadingIndicator
				animation="border"
				variant="primary"
			/>}
		<Switch>
			{/* Public routes */}
			<Route exact path="/" component={MainPage} />
			<Route path="/about" component={AboutView} />
			<Route path="/oferta" component={Oferta} />
			<Route path="/legaldocs" component={LegalDocs} />
			<Route path="/privacypolicy" component={PrivacyPolicy} />
			<Route path="/showcase" component={ShowcaseView} />
			<Route path="/teachers/:department?" component={TeachersView} />
			<Route path="/login" component={LoginView} />
			<Route path="/recover" component={RecoverView} />
			<Route path="/register" component={RegisterView} />
			<Route path="/blog" component={BlogView} />
			<Route path="/contacts" component={ContactsView} />
			<Route path="/apply/:status?" component={PublicApplyView} />
			<Route path="/prices" component={PricesView} />
			<Route path="/pay/:status" component={PaymentView} />
			<Route path="/activate/:email/:uuid" component={ActivateAccountView} />
			<Route path="/reset/:email/:uuid" component={PassResetView} />
			{/* Private teacher routes */}
			<PrivateRoute exact path="/school" component={SchoolExplained} />
			<PrivateRoute path="/school/users/:id" component={UserProfileView} />
			<PrivateRoute path="/school/groups/:id" component={GroupDetails} />
			<PrivateRoute path="/school/groups" component={GroupsView} />
			<PrivateRoute path="/school/pupils/f1/:id" component={PupilFormF1} />
			<PrivateRoute path="/school/pupils/:id" component={PupilDetails} />
			<PrivateRoute path="/school/pupils" component={PupilsView} />
			<PrivateRoute path="/school/teacher/payments" component={TeacherPaymentsView} />
			{/* Private super user routes */}
			<PrivateRoute path="/school/overview" component={SchoolOverview} />
			<PrivateRoute path="/school/users" component={UsersListView} />
			<PrivateRoute path="/school/teachers/:id" component={TeacherDetails} />
			<PrivateRoute path="/school/teachers" component={ListOfTeachers} />
			<PrivateRoute path="/school/specialties/:id" component={SpecialtyDetails} />
			<PrivateRoute path="/school/specialties" component={Specialties} />
			<PrivateRoute path="/school/payments" component={LiqPayPayments} />
			{/* Page not found */}
			<Route path="*" component={FourZeroFour} />
		</Switch>
		<ScrollToTopArrow />
	</Router>
}

const mapStateToProps = state => {
	return {
		fetchingData: state.notification.fetchingData
	}
}

export default connect (
	mapStateToProps,
)(Routes)
