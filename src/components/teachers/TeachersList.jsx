import React, { useEffect, useState, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'
import { initializeTeachers, createTeacher } from '../../reducers/teachersReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'

import { Link } from 'react-router-dom'
import { Container, ListGroup, Row, Col } from 'react-bootstrap'
import CollapseForm from '../common/CollapseForm'
import Teacher from './Teacher'
import LoadingIndicator from '../common/LoadingIndicator'

const LazyTeacherForm = React.lazy(() => import('../forms/TeacherForm'))

const TeachersList = ({
	teachers,
	setNotification,
	initializeTeachers,
	initializeSpecialties,
	setProcessingForm,
	createTeacher
}) => {

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// prepare data for the form i guess
		initializeSpecialties()
			.catch(error => {
				setNotification({
					message: `Щось пішло не так, спробуйте пізніше:
						${error.status} ${error.statusText}`,
					variant: 'danger'
				}, 5)
			})
		initializeTeachers()
			.catch(error => {
				setNotification({
					message: `Щось пішло не так, спробуйте пізніше:
						${error.status} ${error.statusText}`,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setIsLoading(false))
	// eslint-disable-next-line
	}, [])

	const processTeacherData = (values, setErrors, resetForm) => {
		// no linked teacher id cause we are creating
		// a teacher profile without linked account
		// only visible to admins
		setProcessingForm(true)
		createTeacher(values)
			.then(() => {
				setNotification({
					message: 'Новий вчітель був успішно додан.',
					variant: 'success'
				}, 5)
				resetForm()
			})
			.catch(error => {
				const { message, cause } = { ...error.response.data }
				if (cause === 'name') {
					setErrors({ name: message })
				}
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingForm(false))
	}

	return (
		<Container>
			<Row className="d-flex justify-content-center">
				<Col md={10} xl={8}>
					{isLoading
						? <LoadingIndicator
							animation="border"
							variant="primary"
						/>
						: <>
							<p className="py-3 text-muted">
								Щоб додати нового викладача, спочатку потрібно створити його
								<Link to="/school/specialties"> спеціальність</Link>,
								якщо ви цього ще не зробили.
							</p>

							<CollapseForm
								title="Додати нового вчітеля"
								ariaControls="school-class-add-form-collapse"
							>
								<Suspense
									fallback={
										<LoadingIndicator
											animation="border"
											variant="primary"
										/>}>
									<LazyTeacherForm
										mode="create"
										processTeacherData={processTeacherData}
									/>
								</Suspense>
							</CollapseForm>

							<p className="py-3 text-muted">
								<em>Список усіх вчителів школи.</em>
							</p>
							<ListGroup>
								{teachers.map((teacher, index) =>
									<ListGroup.Item
										className="px-0 py-1"
										key={teacher.id}
									>
										<Teacher teacher={teacher} number={index + 1}/>
									</ListGroup.Item>
								)}
							</ListGroup>
						</>
					}
				</Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		teachers: state.teachers,
		specialties: state.specialties,
		processingForm: state.notification.processingForm
	}
}

const mapDispatchToProps = {
	setNotification,
	createTeacher,
	initializeTeachers,
	initializeSpecialties,
	setProcessingForm
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeachersList)
