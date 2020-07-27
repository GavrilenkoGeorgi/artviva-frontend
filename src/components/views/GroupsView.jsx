import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import { getGroups } from '../../reducers/schoolClassesReducer'
import { setNotification,  setFetchingData } from '../../reducers/notificationReducer'
import schoolClassesService from '../../services/schoolClasses'

import { Link } from 'react-router-dom'
import { Container, Col } from 'react-bootstrap'
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
		<Container className="d-flex justify-content-center">
			<Col lg={7} className="px-0">
				{user
					? <>
						<h4 className="pb-3 text-center custom-font">
							{`${user.superUser ? 'Всі' : 'Ваші'} групи в школи`}
						</h4>
						<SchoolClassesList />

						<Col className="px-0">
							<p className="py-4 text-muted">
								Для створення групи, ви повинні бути впевнені, що ви
								{!user.teacher
									? <> заповнили <Link to={`/school/users/${user.id}`}>анкету вчителя</Link>, та </>
									: ' '}
								створили <Link to="/school/pupils">учнів</Link> для вашої нової групи.
							</p>
						</Col>

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
					</>
					: <>Just a sec..</>
				}
			</Col>
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
	getGroups,
	setNotification,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupsView)
