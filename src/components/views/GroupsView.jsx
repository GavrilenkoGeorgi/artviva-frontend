import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { initializeSchoolClasses, getGroups } from '../../reducers/schoolClassesReducer'
import { setNotification,  setFetchingData } from '../../reducers/notificationReducer'
import schoolClassesService from '../../services/schoolClasses'

import { Container } from 'react-bootstrap'
import SchoolClassesList from '../schoolClasses/SchoolClassesList'
import CollapseForm from '../common/CollapseForm'
import LoadingIndicator from '../common/LoadingIndicator'
import { useEffect } from 'react'

const LazySchoolClassForm = React.lazy(() => import('../forms/SchoolClassForm'))

const GroupsView = ({ user, getGroups, setNotification }) => {

	useEffect(() => {
		setFetchingData(true)
	}, [])

	useEffect(() => {
		if (user) {
			schoolClassesService.setToken(user.token)
			getGroups(user.superUser, user.teacher)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${message}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}, [user, setNotification, getGroups])

	return (
		<Container>
			{user
				? <>
					<h4 className="pb-3 text-center custom-font">
						{`${user.superUser ? 'Всі' : 'Ваші'} групи в школи`}
					</h4>
					<CollapseForm
						title={`Додати нову групу ${user.superUser ? '(як завуч)' : '' }`}
						ariaControls="school-class-add-form-collapse"
					>
						<Suspense
							fallback={
								<LoadingIndicator
									animation="border"
									variant="primary"
								/>}>
							<LazySchoolClassForm mode="create" />
						</Suspense>
					</CollapseForm>
					<SchoolClassesList />
				</>
				: <>Just a sec..</>
			}
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		groups: state.schoolClasses,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	initializeSchoolClasses,
	getGroups,
	setNotification,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupsView)
