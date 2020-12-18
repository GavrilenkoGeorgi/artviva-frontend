import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification, setProcessingForm, setFetchingData } from '../../reducers/notificationReducer'
import { deleteTeacher, updateTeacher } from '../../reducers/teachersReducer'
import { getTeacherData } from '../../reducers/teacherDataReducer'

import { Link } from 'react-router-dom'
import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import TeacherForm from '../forms/TeacherForm'
import LoadingIndicator from '../common/LoadingIndicator'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Teacher = ({
	user,
	teacher,
	number,
	specialties,
	fetchingData,
	processingForm,
	updateTeacher,
	getTeacherData,
	setNotification,
	setProcessingForm,
	setFetchingData
}) => {

	const [open, setOpen] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const unmounted = useRef(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [user])

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

	return <>
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
						{teacher.schoolClasses.map((item, index) =>
							<span key={index} className="d-block my-2">
								<Link to={`/school/groups/${item.id}`}>{item.title}</Link>
							</span>
						)}
					</Col>
				</Row>
				<Row>
					<EntityControlButtons
						route={`/school/teachers/${teacher.id}`}
						entity="teacher"
						fetchingTeacherData={fetchingData}
						openEditModal={() => openEditModal(teacher.id)}
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
				subject="Редагувати дані вчітеля"
				subjectid={teacher.id}
				show={editModalShow}
				onHide={() => setEditModalShow(false)}
			>
				<TeacherForm
					user={user}
					processingForm={processingForm}
					processTeacherData={saveTeacherEdits}
					teacher={teacher}
					specialties={specialties}
					mode="edit" />
			</LazyEntityEditModal>
		</Suspense>
	</>
}

const mapStateToProps = state => ({
	user: state.user,
	specialties: state.specialties,
	fetchingData: state.notification.fetchingData,
	processingForm: state.notification.processingForm
})

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
