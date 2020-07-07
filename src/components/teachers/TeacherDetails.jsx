import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import teachersService from '../../services/teachers'
import { setNotification } from '../../reducers/notificationReducer'
import moment from 'moment'
import 'moment-precise-range-plugin'
import { nestedSort } from '../../utils/arrayHelpers'

import { Container, Row, Col } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import TeacherPayments from './TeacherPayments'
import TeacherInfo from './TeacherInfo'
import { CollapseComponent } from '../common'

const TeacherDetails = ({ user, match, teacher, setNotification }) => {

	const [teacherDetails, setTeacherDetails] = useState(null)
	const [teacherExperience, setTeacherExperience] = useState({})

	const calcXpToDate = useCallback(({ employmentDate, experienceToDate }) => {
		const date = moment()
		const { years, months, days } = experienceToDate
		const adjustedExperienceDate = moment(employmentDate).subtract({ years, months, days })
		const experience = moment.preciseDiff(adjustedExperienceDate, date, true)
		setTeacherExperience(experience)
	}, [])

	useEffect(() => {
		if (teacher.id) {
			setTeacherDetails(teacher)
			setTeacherDetails({
				...teacher,
				payments: teacher.payments.sort(nestedSort('create_date', null, 'desc'))
			})
			calcXpToDate(teacher)
		}
	}, [teacher, calcXpToDate])

	useEffect(() => {
		if (user && match) {
			teachersService.setToken(user.token)
			teachersService.getById(match.params.id)
				.then((data) => {
					setTeacherDetails({
						...data,
						payments: data.payments.sort(nestedSort('create_date', null, 'desc'))
					})
					calcXpToDate(data)
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
		<>
			{teacherDetails
				? <Container className="pt-3">
					<Row>
						{/* Payments section */}
						<Col xs={12} className="px-0">
							<CollapseComponent
								title="Всі платежі"
								ariaControls="payments-collapse"
							>
								<TeacherPayments
									payments={teacherDetails.payments}
								/>
							</CollapseComponent>
						</Col>
						{/* Details section */}
						<Col xs={12} className="px-0">
							<CollapseComponent
								title="Детальна інформація про вчителя"
								ariaControls="teacher-info-collapse"
							>
								<TeacherInfo
									teacher={teacherDetails}
									teacherExperience={teacherExperience}
								/>
							</CollapseComponent>
						</Col>
					</Row>
				</Container>
				: <LoadingIndicator animation="border" variant="primary" />
			}
		</>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		teacher: state.teacher
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeacherDetails)
