import React from 'react'
import { connect } from 'react-redux'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'
import { createTeacher } from '../../reducers/teachersReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'

import { Link } from 'react-router-dom'

import TeacherForm from '../forms/TeacherForm'

const AddTeacher = ({
	user,
	specialties,
	processingForm,
	setNotification,
	setProcessingForm,
	createTeacher,
	showModal,
}) => {

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
				showModal(false)
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

	return <>
		<p className="py-3 text-muted">
			Щоб додати нового викладача, спочатку потрібно створити його
			<Link to="/school/specialties"> спеціальність</Link>,
			якщо ви цього ще не зробили.
		</p>
		<TeacherForm
			user={user}
			processingForm={processingForm}
			mode="create"
			processTeacherData={processTeacherData}
			specialties={specialties}
		/>
	</>
}

const mapStateToProps = state => ({
	user: state.user,
	specialties: state.specialties,
	processingForm: state.notification.processingForm
})

const mapDispatchToProps = {
	setNotification,
	createTeacher,
	initializeSpecialties,
	setProcessingForm
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddTeacher)
