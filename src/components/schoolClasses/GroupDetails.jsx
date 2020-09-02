import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import schoolClassesService from '../../services/schoolClasses'
import { setNotification } from '../../reducers/notificationReducer'

import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import CommonLayout from '../views/CommonLayout'

const GroupDetails = ({ user, match, setNotification }) => {

	const [groupDetails, setGroupDetails] = useState(null)

	useEffect(() => {
		if (user) {
			schoolClassesService.setToken(user.token)
			schoolClassesService.getById(match.params.id)
				.then((data) => {
					console.log('Data', data)
					setGroupDetails(data)
				})
				.catch(error => {
					const notification = JSON.parse(error.request.responseText)
					setNotification({
						message: notification.error,
						variant: 'danger'
					}, 5)
				})
		}
	// eslint-disable-next-line
	}, [user])

	return (
		<CommonLayout>
			{groupDetails
				? <Container>
					<h4 className="text-muted text-center serif-font">{groupDetails.title}</h4>
					<Row>
						<Col xs={12}>
							<h5 className="text-center">{groupDetails.teacher.name}</h5>
							<p className="text-center">{groupDetails.specialty.title}</p>
						</Col>
						<Col>
							<Container>
								{groupDetails.pupils.map((pupil, idx) => (
									<Row key={pupil.id} className="py-2 my-2 border rounded">
										<Col xs={12} className="border1">
											{`${idx + 1}. `}
											<Link to={`/school/pupils/${pupil.id}`}>
												{pupil.name}</Link>{' '}
											<em className="text-muted">{pupil.artSchoolClass} клас</em>
										</Col>
										<Col xs={12} className="d-flex justify-content-between text-muted">
											<em>{pupil.info}</em>
											<small>
												{pupil.assignedTo.name} {pupil.assignedTo.lastname}
											</small>
										</Col>
									</Row>
								))}
							</Container>
						</Col>
					</Row>
				</Container>
				: <LoadingIndicator animation="border" variant="primary" />
			}
		</CommonLayout>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupDetails)
