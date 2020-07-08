import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userService from '../../services/users'
import { getTeacherData, updateTeacherData } from '../../reducers/teacherDataReducer'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'
import { trimObject } from '../../utils/objectHelpers'

import { Container, Row, Col } from 'react-bootstrap'
import UserDetailsCard from '../users/UserDetailsCard'
import TeacherDetails from '../teachers/TeacherDetails'
import TeacherForm from '../forms/TeacherForm'
import { CollapseComponent, LoadingIndicator } from '../common'

const UserProfileView = ({
	user,
	teacher,
	match,
	getTeacherData,
	initializeSpecialties,
	updateTeacherData,
	setNotification,
	setProcessingForm }) => {

	const [userData, setUserData] = useState(null)
	const [teacherDataPresent, setTeacherDataPresent] = useState(true)

	useEffect(() => {
		if (user && (user.id === match.params.id)) {
			setUserData(user)
		} else if (user) {
			userService.setToken(user.token)
			userService.getById(match.params.id)
				.then(user => {
					setUserData(user)
				})
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
		}
	}, [user, match.params.id, setNotification])

	useEffect(() => {
		if (userData && userData.teacher) {
			initializeSpecialties()
			getTeacherData(userData.teacher)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
		} else if (userData && !userData.teacher) {
			setTeacherDataPresent(false)
		}
	}, [userData, getTeacherData, setNotification, initializeSpecialties])

	const processTeacherData = async values => {
		setProcessingForm(true)
		values = {
			...values,
			linkedUserAccountId: userData.id
		}
		updateTeacherData(teacher.id, trimObject(values))
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingForm(false))
	}

	return (
		<Container>
			{userData
				? <Row className="border1 border-primary text-center1">
					<Col xs={12} md={7}>
						<h3 className="text-center">Профіль</h3>
						<UserDetailsCard mode="single" userData={userData}/>
						<div className="border1 border-success">
							{teacher
								? <TeacherDetails />
								: null
							}
						</div>
					</Col>
					<Col xs={12} md={5}>
						<CollapseComponent
							title={teacherDataPresent ? 'Редагувати дані вчителя' : 'Заповніть дані вчителя'}
							ariaControls="pupil-add-form-collapse"
						>
							{teacher
								? <TeacherForm
									processTeacherData={processTeacherData}
									teacher={teacher}
									mode={teacher ? 'edit' : 'create'}
								/>
								: null
							}
						</CollapseComponent>
					</Col>
				</Row>
				: <LoadingIndicator
					animation="border"
					variant="primary"
				/>
			}
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		teacher: state.teacher
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	getTeacherData,
	initializeSpecialties,
	updateTeacherData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserProfileView)

