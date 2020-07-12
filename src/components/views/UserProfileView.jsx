import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import userService from '../../services/users'
import loginService from '../../services/login'
import { getTeacherData, updateTeacherData, createTeacherData } from '../../reducers/teacherDataReducer'
import { refreshUserData } from '../../reducers/loginReducer'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'
import { trimObject } from '../../utils/objectHelpers'

import { Container, Row, Col } from 'react-bootstrap'
import UserDetailsCard from '../users/UserDetailsCard'
import TeacherDetails from '../teachers/TeacherDetails'
import TeacherForm from '../forms/TeacherForm'
import { CollapseComponent } from '../common'

const UserProfileView = ({
	user,
	teacher,
	match,
	getTeacherData,
	initializeSpecialties,
	updateTeacherData,
	createTeacherData,
	setNotification,
	refreshUserData,
	setProcessingForm }) => {

	const [userData, setUserData] = useState(null)
	const [teacherDataPresent, setTeacherDataPresent] = useState(true)
	const unmounted = useRef(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	useEffect(() => {
		if (user && (user.id === match.params.id)) {
			setUserData(user)
			initializeSpecialties()
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
	}, [user, match.params.id, setNotification, initializeSpecialties])

	useEffect(() => {
		if (userData && userData.teacher) {
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
	}, [userData, getTeacherData, setNotification])

	const processTeacherData = async values => {
		setProcessingForm(true)
		if (teacher.id) {
			update(teacher.id, values)
		} else {
			values = {
				...values,
				linkedUserAccountId: userData.id
			}
			// create new teacher
			create(values)
		}
	}

	const update = (id, values) => {
		updateTeacherData(id, trimObject(values))
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
			.finally(() => {
				if (!unmounted.current) {
					setProcessingForm(false)
				}
			})
	}

	const create = values => {
		createTeacherData(trimObject(values))
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
				// all ok, update current user refs
				// sort of relogin
				loginService.setToken(user.token)
				refreshUserData(user.id)
					.catch(error => {
						console.error(error)
					})
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (!unmounted.current) {
					setProcessingForm(false)
				}
			})
	}

	return (
		<Container className="py-2">
			{userData
				? <Row>
					<Col xs={12} md={7} className="pb-3">
						<h4 className="text-center custom-font">Профіль</h4>
						<UserDetailsCard mode="single" userData={userData}/>
						<div>
							{teacher
								? <TeacherDetails />
								: null
							}
						</div>
					</Col>
					<Col xs={12} md={5}>
						<h4 className="text-center custom-font">
							Ваші дані
						</h4>
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
								: <>Just a sec..</>
							}
						</CollapseComponent>
					</Col>
				</Row>
				: null
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
	updateTeacherData,
	createTeacherData,
	refreshUserData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserProfileView)

