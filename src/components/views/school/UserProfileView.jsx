import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import userService from '../../../services/users'
import { getTeacherData, updateTeacherData, createTeacherData } from '../../../reducers/teacherDataReducer'
import { refreshUserData } from '../../../reducers/loginReducer'
import { setNotification, setProcessingForm, setFetchingData } from '../../../reducers/notificationReducer'
import { trimObject } from '../../../utils/objectHelpers'

import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap'
import UserDetailsCard from '../../users/UserDetailsCard'
import TeacherForm from '../../forms/TeacherForm'
import CommonLayout from '../../CommonLayout'
import TeacherDetails from '../../teachers/TeacherDetails'

const UserProfileView = ({
	user,
	teacher,
	specialties,
	match,
	getTeacherData,
	updateTeacherData,
	createTeacherData,
	setNotification,
	refreshUserData,
	setFetchingData,
	processingForm,
	setProcessingForm }) => {

	const [userData, setUserData] = useState(null)
	const unmounted = useRef(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	// get detailed user data
	useEffect(() => {
		async function getDetailedUserData () {
			setFetchingData(true)
			// eslint-disable-next-line
			const userDetails = await userService.getById(match.params.id)
			if (userDetails) {
				setUserData(userDetails)
				if (userDetails.teacher) getTeacherData(userDetails.teacher.id)
			}
			if (!unmounted.current) setFetchingData(false)
		}
		getDetailedUserData()
	}, [user, match.params.id, setFetchingData, getTeacherData])

	const processTeacherData = async values => {
		setProcessingForm(true)
		if (teacher) {
			updateTeacher(teacher.id, values)
		} else {
			values = {
				...values,
				linkedUserAccountId: userData.id
			}
			// create new teacher
			createNewTeacher(values)
		}
	}

	const updateTeacher = (id, values) => {
		updateTeacherData(id, trimObject(values))
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
			})
			.finally(() => {
				if (!unmounted.current) setProcessingForm(false)
			})
	}

	const createNewTeacher = values => {
		createTeacherData(trimObject(values))
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
				// all ok, update current user refs
				// sort of relogin
				refreshUserData(user.id)
			})
			.finally(() => {
				if (!unmounted.current) setProcessingForm(false)
			})
	}

	return <>
		<Helmet>
			<title>Перегляд профілю користувача</title>
			<meta name="description" content="Інформація про поточного користувача."/>
		</Helmet>
		<CommonLayout>
			{userData && <Tabs defaultActiveKey="user-account" id="user-data-tabs">
				<Tab eventKey="user-account" title="Аккаунт">
					<Col className="pt-4">
						<UserDetailsCard mode="single" userData={userData}/>
					</Col>
				</Tab>
				<Tab eventKey="teacher-profile" title="Редагувати">
					<Container className="py-3">
						<Row className="d-flex justify-content-center">
							<Col md={9} className={`py-3 text-center ${teacher ? 'text-primary' : 'text-warning'}`}>
								{teacher
									? <span>Тут ви можете редагувати свій профіль викладача.</span>
									: <span>
										Схоже, ви ще не заповнили дані свого вчителя, будь ласка, заповніть їх.
									</span>
								}
							</Col>
							<Col md={9}>
								<TeacherForm
									user={user}
									processTeacherData={processTeacherData}
									teacher={teacher}
									specialties={specialties}
									mode={teacher ? 'edit' : 'create'}
									processingForm={processingForm}
								/>
							</Col>
						</Row>
					</Container>
				</Tab>
				<Tab eventKey="user-data" title="Дані вчителя">
					<Col className="pt-4">
						{teacher
							? <TeacherDetails teacher />
							: <span className="text-center text-warning">
								Схоже, ви ще не заповнили дані свого вчителя, будь ласка, заповніть їх.
							</span>
						}
					</Col>
				</Tab>
			</Tabs>
			}
		</CommonLayout>
	</>
}

const mapStateToProps = state => {
	return {
		user: state.user,
		teacher: state.teacher,
		specialties: state.specialties,
		processingForm: state.notification.processingForm,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	setFetchingData,
	getTeacherData,
	updateTeacherData,
	createTeacherData,
	refreshUserData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserProfileView)
