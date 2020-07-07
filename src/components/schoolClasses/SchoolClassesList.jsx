import React, { useState, useEffect, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import schoolClassesService from '../../services/schoolClasses'

import { Link } from 'react-router-dom'
import { Container, ListGroup, Row, Col } from 'react-bootstrap'
import SchoolClass from './SchoolClass'
import LoadingIndicator from '../common/LoadingIndicator'
import CollapseForm from '../common/CollapseForm'

const LazySchoolClassForm = React.lazy(() => import('../forms/SchoolClassForm'))

const SchoolClassesList = ({
	user,
	getGroups,
	schoolClasses,
	setNotification
}) => {

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (user) {
			schoolClassesService.setToken(user.token)
			getGroups(user.teacher)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${message}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setIsLoading(false))
		}
	}, [user, setNotification, getGroups])

	return (
		<Container>
			<Row className="d-flex justify-content-center">
				<Col md={10} xl={8}>
					{isLoading
						? <LoadingIndicator
							animation="border"
							variant="primary"
						/>
						: <>
							<p className="py-3 text-muted">
								Для створення групи, ви повинні бути впевнені,
								що ви створили <Link to="/school/teachers">вчителя</Link>,&nbsp;
								<Link to="/school/specialties">спеціальність</Link> та&nbsp;
								<Link to="/school/pupils">учнів</Link> для вашої нової групи.
							</p>

							<CollapseForm
								title="Додати нову групу"
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

							<p className="py-3 text-muted">
								<em>Список усіх груп школи.</em>
							</p>
							<ListGroup>
								{schoolClasses.map(schoolClass =>
									<ListGroup.Item
										className="px-0 py-1"
										key={schoolClass.id}
									>
										<SchoolClass schoolClass={schoolClass} />
									</ListGroup.Item>
								)}
							</ListGroup>
						</>
					}
				</Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		schoolClasses: state.schoolClasses
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SchoolClassesList)
