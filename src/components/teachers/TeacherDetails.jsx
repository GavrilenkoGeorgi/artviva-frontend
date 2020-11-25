import React, { useEffect, useState, useCallback, Suspense, useRef } from 'react'
import { connect } from 'react-redux'
import teachersService from '../../services/teachers'
import { setNotification, setProcessingForm, setFetchingData } from '../../reducers/notificationReducer'
import { deleteTeacher, updateTeacher } from '../../reducers/teachersReducer'
import { getTeacherData } from '../../reducers/teacherDataReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'
import moment from 'moment'
import 'moment-precise-range-plugin'
import { nestedSort } from '../../utils/arrayHelpers'

import { Container, Row } from 'react-bootstrap'
import TeacherInfo from './TeacherInfo'

import TeacherForm from '../forms/TeacherForm'
import LoadingIndicator from '../common/LoadingIndicator'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const TeacherDetails = ({
	user,
	match,
	teacher,
	fetchingData,
	getTeacherData,
	updateTeacher,
	setProcessingForm,
	initializeSpecialties,
	setFetchingData,
	setNotification }) => {

	const [teacherDetails, setTeacherDetails] = useState(null)
	const [teacherExperience, setTeacherExperience] = useState({})
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const unmounted = useRef(false)

	const calcXpToDate = useCallback(({ employmentDate, experienceToDate }) => {
		const date = moment()
		const { years, months, days } = experienceToDate
		const adjustedExperienceDate = moment(employmentDate).subtract({ years, months, days })
		const experience = moment.preciseDiff(adjustedExperienceDate, date, true)
		setTeacherExperience(experience)
	}, [])

	useEffect(() => {
		if (teacher.id) {
			setTeacherDetails({
				...teacher,
				payments: teacher.payments.sort(nestedSort('create_date', null, 'desc'))
			})
			calcXpToDate(teacher)
			initializeSpecialties()
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
		}
	}, [teacher, calcXpToDate, initializeSpecialties, setNotification])

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
	}, [user, calcXpToDate, setNotification, match])

	const saveTeacherEdits = values => {
		setProcessingForm(true)
		updateTeacher(teacher.id, values)
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
				setEditModalShow(false)
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

	const openEditModal = id => {
		setFetchingData(true)
		getTeacherData(id)
			.then(() => {
				setEditModalShow(true)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				setFetchingData(false)
			})
	}

	const handleDelete = id => {
		setIsDeleting(true)
		deleteTeacher(id)
			.then(() => {
				setNotification({
					message: 'Вчітель успішно видален.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
				setIsDeleting(false)
				setDeleteModalShow(false)
			})
			.finally(() => {
				if (!unmounted) setIsDeleting(false)
			})
	}

	return (
		<Container>
			<Row className="justify-content-center">
				{teacherDetails
					? <TeacherInfo
						teacher={teacherDetails}
						teacherExperience={teacherExperience}
					/>
					: <p className="text-warning">
							Схоже, ви ще не заповнили дані свого вчителя, будь ласка, заповніть їх.
					</p>
				}
			</Row>

			{teacherDetails
				? <>
					{/* Control buttons */}
					<Row>
						<EntityControlButtons
							route={`/school/teachers/${teacherDetails.id}`}
							fetchingTeacherData={fetchingData}
							openEditModal={() => openEditModal(teacherDetails.id)}
							openDeleteModal={() => setDeleteModalShow(true)}
						/>
					</Row>
					<Row>
						{/* Teacher edit and delete modal */}
						<Suspense fallback={
							<LoadingIndicator
								animation="border"
								variant="primary"
								size="md"
							/>}>
							<LazyEntityEditModal
								subject="Редагувати дані вчітеля"
								subjectid={teacherDetails.id}
								show={editModalShow}
								onHide={() => setEditModalShow(false)}
							>
								<TeacherForm
									processTeacherData={saveTeacherEdits}
									teacherData={teacherDetails}
									mode="edit" />
							</LazyEntityEditModal>
							<LazyEntityDeleteModal
								subject="Видалити вчітеля"
								subjectid={teacherDetails.id}
								valuetoconfirm={teacherDetails.name}
								show={deleteModalShow}
								handleDelete={handleDelete}
								loadingState={isDeleting}
								onHide={() => setDeleteModalShow(false)}
							/>
						</Suspense>
					</Row>
				</>
				: null
			}
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		teacher: state.teacher,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	setFetchingData,
	deleteTeacher,
	updateTeacher,
	getTeacherData,
	initializeSpecialties
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeacherDetails)
