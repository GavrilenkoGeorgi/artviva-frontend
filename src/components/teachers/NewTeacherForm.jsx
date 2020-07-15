import React, { useEffect, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'
import { createTeacher } from '../../reducers/teachersReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'

import { Link } from 'react-router-dom'
import { CollapseComponent } from '../common'
import LoadingIndicator from '../common/LoadingIndicator'

const LazyTeacherForm = React.lazy(() => import('../forms/TeacherForm'))

const NewTeacherForm = ({
	setNotification,
	initializeSpecialties,
	setProcessingForm,
	createTeacher
}) => {

	useEffect(() => {
		// we need human readable specialties titles
		initializeSpecialties()
			.catch(error => {
				setNotification({
					message: `Щось пішло не так, спробуйте пізніше:
						${error.status} ${error.statusText}`,
					variant: 'danger'
				}, 5)
			})
	}, [initializeSpecialties, setNotification])

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
		<>
			<p className="py-3 text-muted">
				Щоб додати нового викладача, спочатку потрібно створити його
				<Link to="/school/specialties"> спеціальність</Link>,
				якщо ви цього ще не зробили.
			</p>
			<CollapseComponent
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
			</CollapseComponent>
		</>
	)
}

const mapStateToProps = state => {
	return {
		specialties: state.specialties
	}
}

const mapDispatchToProps = {
	setNotification,
	createTeacher,
	initializeSpecialties,
	setProcessingForm
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewTeacherForm)
