import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import userService from '../../services/users'
import loginService from '../../services/login'
import { getTeacherData, updateTeacherData, createTeacherData } from '../../reducers/teacherDataReducer'
import { refreshUserData } from '../../reducers/loginReducer'
import { setNotification, setProcessingForm, setFetchingData } from '../../reducers/notificationReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'
import { trimObject } from '../../utils/objectHelpers'

import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap'
import UserDetailsCard from '../users/UserDetailsCard'
import TeacherForm from '../forms/TeacherForm'
import CommonLayout from './CommonLayout'
import TeacherDetails from '../teachers/TeacherDetails'

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
	setFetchingData,
	setProcessingForm }) => {

	const [userData, setUserData] = useState(null)
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
			setFetchingData(true)
			getTeacherData(userData.teacher)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
				.finally(setFetchingData(false))
		}
	}, [userData, getTeacherData, setNotification, setFetchingData])

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
		<CommonLayout>
			{userData
				? <Tabs defaultActiveKey="user-account" id="user-data-tabs">
					<Tab eventKey="user-account" title="Ваш аккаунт">
						<Col className="pt-4">
							<UserDetailsCard mode="single" userData={userData}/>
						</Col>
					</Tab>
					<Tab eventKey="teacher-profile" title="Редагувати профіль вчителя">
						{teacher
							? <Container className="py-3">
								<Row className="d-flex justify-content-center">
									{!user.teacher
										? <Col xs={12} className="py-3 text-center text-warning">
											Схоже, ви ще не заповнили дані свого вчителя, будь ласка, заповніть їх.
										</Col>
										: null
									}
									<Col md={9}>
										<TeacherForm
											processTeacherData={processTeacherData}
											teacher={teacher}
											mode={teacher ? 'edit' : 'create'}
										/>
									</Col>
								</Row>
							</Container>
							: <Col xs={12} className="py-3 text-center">
								Схоже, ви ще не заповнили дані свого вчителя, будь ласка, заповніть їх.
							</Col>
						}
					</Tab>
					<Tab eventKey="user-data" title="Ваші дані">
						<Col className="pt-4">
							<TeacherDetails teacher/>
						</Col>
					</Tab>
				</Tabs>
				: null
			}
		</CommonLayout>
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
	setFetchingData,
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
