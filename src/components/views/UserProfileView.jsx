import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import userService from '../../services/users'
import loginService from '../../services/login'
import { getTeacherData, updateTeacherData, createTeacherData } from '../../reducers/teacherDataReducer'
import { refreshUserData } from '../../reducers/loginReducer'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'
import { trimObject } from '../../utils/objectHelpers'

import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap'
import UserDetailsCard from '../users/UserDetailsCard'
import TeacherForm from '../forms/TeacherForm'
import CommonLayout from './CommonLayout'

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
			// setTeacherDataPresent(false)
			// console.log('Invite user to fill teacher data')
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
		<CommonLayout>
			{userData
				? <Tabs defaultActiveKey="teacher-profile" id="user-data-tabs">
					<Tab eventKey="user-data" title="Ваші дані">
						<Col className="pt-4">
							<UserDetailsCard mode="single" userData={userData}/>
						</Col>
					</Tab>
					<Tab eventKey="teacher-profile" title="Ваш профіль вчителя">
						{teacher
							? <Container className="py-3">
								<Row className="d-flex justify-content-center">
									<Col md={9}>
										<TeacherForm
											processTeacherData={processTeacherData}
											teacher={teacher}
											mode={teacher ? 'edit' : 'create'}
										/>
									</Col>
								</Row>
							</Container>
							: <>Just a sec..</>
						}
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
