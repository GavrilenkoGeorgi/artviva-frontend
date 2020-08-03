import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification, setProcessingForm, setFetchingData } from '../../reducers/notificationReducer'
import { deleteTeacher, updateTeacher } from '../../reducers/teachersReducer'
import { getTeacherData } from '../../reducers/teacherDataReducer'
import teachersService from '../../services/teachers'

import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import TeacherForm from '../forms/TeacherForm'
import LoadingIndicator from '../common/LoadingIndicator'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Teacher = ({
	user,
	teacher,
	number,
	fetchingData,
	deleteTeacher,
	updateTeacher,
	getTeacherData,
	setNotification,
	setProcessingForm,
	setFetchingData
}) => {

	const [open, setOpen] = useState(false)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const unmounted = useRef(false)

	// set auth token
	useEffect(() => {
		teachersService.setToken(user.token)
		return () => { unmounted.current = true }
	}, [user])

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

	const showExperience = ({ years, months, days }) => {
		return <small>
			<em className="text-muted">
				{/* eslint-disable-next-line */}
				Стаж {years > 0 ? `${years} років` : null} {months > 0 ? `${months} місяців` : null} {days > 0 ? `${days} днів` : null}
			</em>
		</small>
	}

	return (
		<>
			<Button
				block
				onClick={() => setOpen(!open)}
				aria-controls="teacher-collapse"
				aria-expanded={open}
				variant="link"
			>
				<Row className="text-left d-flex justify-content-between">
					<Col xs={10} className="">
						{number}. {teacher.name}
					</Col>

					<Col xs={2} className="text-right">
						{open
							? <FontAwesomeIcon icon={faAngleUp} />
							: <FontAwesomeIcon icon={faAngleDown} />
						}
					</Col>

					<Col xs={12} className="pl-4">
						{showExperience(teacher.experience)}
						<br />
						<small>
							<em className="text-muted">
								Тижневе навантаження {teacher.weekWorkHours} годин
							</em>
						</small>
					</Col>
				</Row>
			</Button>
			<Collapse in={open}>
				<Container fluid className="text-left">
					<Row>
						<Col>
							{teacher.specialties.map(specialty => (
								<p className="custom-font-small text-muted" key={specialty.id}>{specialty.title}</p>
							))}
							<p>{(teacher.weekWorkHours / 18).toFixed(2)} ставки</p>
							<p className="pt-3">
								<strong>Груп: {teacher.schoolClasses.length || '0'}</strong>
							</p>
							{teacher.schoolClasses.map((item, index) => (
								<p key={index}>{item.title}</p>
							))}
						</Col>
					</Row>
					<Row>
						<EntityControlButtons
							route={teacher.linkedUserAccountId
								? `users/${teacher.linkedUserAccountId}`
								: `teachers/${teacher.id}`
							}
							fetchingTeacherData={fetchingData}
							openEditModal={() => openEditModal(teacher.id)}
							openDeleteModal={() => setDeleteModalShow(true)}
						/>
					</Row>
				</Container>
			</Collapse>

			{/* Teacher edit and delete modal */}
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				<LazyEntityEditModal
					subject="вчітеля"
					subjectid={teacher.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<TeacherForm
						processTeacherData={saveTeacherEdits}
						teacherData={teacher}
						mode="edit" />
				</LazyEntityEditModal>
				<LazyEntityDeleteModal
					subject="вчітеля"
					subjectid={teacher.id}
					valuetoconfirm={teacher.name}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={isDeleting}
					onHide={() => setDeleteModalShow(false)}
				/>
			</Suspense>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	deleteTeacher,
	updateTeacher,
	getTeacherData,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Teacher)
