import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { createSpecialty, updateSpecialty } from '../../reducers/specialtiesReducer'

import { Formik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'
import { trimObject } from '../../utils/objectHelpers'

import { Col, Form } from 'react-bootstrap'
import TextAreaInput from './components/TextAreaInput'
import TextInput from './components/TextInput'
import BtnWithSpinner from '../common/buttons/BtnWithSpinner'
import ResetBtn from './buttons/Reset'

const SpecialtyForm = ({
	specialty,
	user,
	setNotification,
	createSpecialty,
	updateSpecialty,
	mode,
	closeModal }) => {

	const [editMode, setEditMode] = useState(false)
	const [processingForm, setProcessingForm] = useState(false)

	// set auth token and mode
	useEffect(() => {
		if (mode === 'edit') {
			setEditMode(true)
		}
	}, [user, mode])

	// edit or save
	const handleSpecialty = (values, setErrors, resetForm) => {
		setProcessingForm(true)
		editMode
			? existingSpecialty(trimObject(values))
			: newSpecialty(trimObject(values), setErrors, resetForm)
	}

	const newSpecialty = (values, setErrors, resetForm) => {
		createSpecialty(values)
			.then(() => {
				setNotification({
					message: 'Нова спеціальність була успішно додана.',
					variant: 'success'
				}, 5)
				resetForm()
			})
			.catch(error => {
				const { message, cause } = { ...error.response.data }
				if (cause === 'title') {
					setErrors({ title: message })
				}
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingForm(false))
	}

	const existingSpecialty = (values) => {
		updateSpecialty(specialty.id, values)
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
				closeModal()
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

	// form data
	const initialFormValues = () =>
		editMode ? { ...specialty } : { title: '', cost: '', info: '' }

	const specialtyFormSchema = Yup.object().shape({
		title: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повну назву спеціальності.'),
		cost: Yup.number()
			.typeError('Повинно бути числом.')
			.max(9999, 'Не більше 9999 грн.')
			.required('Обов\'язкове поле.')
			.positive('Повинно бути більше нуля.')
			.integer('Повинно бути цілим числом.'),
		info: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(255, 'Максимум 255 символів.')
	})

	return (
		<Formik
			initialValues={initialFormValues()}
			enableReinitialize
			onSubmit={async (values, { resetForm, setErrors }) => {
				await handleSpecialty(values, setErrors, resetForm)
			}}
			validationSchema={specialtyFormSchema}
		>
			{({ handleSubmit,
				handleChange,
				handleBlur,
				handleReset,
				values,
				touched,
				errors
			}) => (
				<Form
					data-cy="specialty-form"
					noValidate
					onSubmit={handleSubmit}
					className="text-left"
				>
					{/* Specialty title input*/}
					<TextInput
						label="Повна назва спеціальності"
						name="title"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.title}
						touched={touched.title}
						errors={errors.title}
					/>

					{/* Specialty cost input */}
					<TextInput
						label="Вартість навчання за місяць"
						name="cost"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.cost}
						touched={touched.cost}
						errors={errors.cost}
					/>

					{/* Specilalty info / descr input */}
					<TextAreaInput
						label="Додаткова інформація/опис"
						rows={2}
						name="info"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.info}
						touched={touched.info}
						errors={errors.info}
					/>

					{/* Button */}
					<Form.Group
						as={Col}
						className="pt-4 px-0 d-flex justify-content-end"
					>
						<BtnWithSpinner
							className="default-width-btn"
							variant={editMode ? 'success' : 'primary'}
							type="submit"
							label={editMode ? 'Зберегти' : 'Додати'}
							dataCy="add-specialty-btn"
							loadingState={processingForm}
						/>
						<ResetBtn
							label="Очистити"
							dataCy="specialty-form-rest-btn"
							variant="light"
							onClick={handleReset}
							className="ml-2 default-width-btn"
						/>
					</Form.Group>
				</Form>
			)}
		</Formik>
	)
}

SpecialtyForm.propTypes = {
	specialty: PropTypes.object,
	user: PropTypes.object.isRequired,
	setNotification: PropTypes.func.isRequired,
	createSpecialty: PropTypes.func.isRequired,
	updateSpecialty: PropTypes.func.isRequired,
	mode: PropTypes.oneOf(['create', 'edit']).isRequired
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification,
	createSpecialty,
	updateSpecialty
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SpecialtyForm)
