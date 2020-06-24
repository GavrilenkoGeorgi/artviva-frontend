import React, { useState } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { updateUser } from '../../reducers/userReducer'

import { Col, Form } from 'react-bootstrap'

import { Formik } from 'formik'
import * as Yup from 'yup'

import BtnWithSpinner from '../common/buttons/BtnWithSpinner'
import TextInput from './components/TextInput'
import CheckBox from './components/Checkbox'

const UserEditForm = ({
	userData, updateUser,
	setNotification, closeModal }) => {

	const [processingForm, setProcessingForm] = useState(false)

	const userEditFormSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'Не менш 3 символів.')
			.max(45, 'Максимум 45 символів.')
			.required('Введіть ім\'я.'),
		middlename: Yup.string()
			.min(2, 'Не менш 3 символів.')
			.max(45, 'Максимум 45 символів.')
			.required('Введіть по батькові.'),
		lastname: Yup.string()
			.min(2, 'Не менш 3 символів.')
			.max(45, 'Максимум 45 символів.')
			.required('Введіть прізвище.'),
		approvedUser: Yup.bool()
			.oneOf([true, false]),
		superUser: Yup.bool()
			.oneOf([true, false])
	})

	const handleUserDetailsEdit = ({
		name,
		middlename,
		lastname,
		approvedUser,
		superUser }) => { // get only needed values

		const updatedValues = {
			name,
			middlename,
			lastname,
			approvedUser,
			superUser
		}

		setProcessingForm(true)
		updateUser(userData.id, updatedValues)
			.then(() => {
				setNotification({
					message: 'Інформація про користувача оновлена.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
				setProcessingForm(false)
			})
			.finally(() => {
				setProcessingForm(false)
				closeModal()
			})
	}

	return (
		<Formik
			initialValues={{ ...userData }}
			onSubmit={async (values) => {
				await handleUserDetailsEdit(values)
			}}
			validationSchema={userEditFormSchema}
		>
			{({ handleSubmit,
				handleChange,
				handleBlur,
				values,
				touched,
				errors
			}) => (
				<Form
					data-cy="register-form"
					noValidate
					onSubmit={handleSubmit}
					className="text-left"
				>
					{/* User name input */}
					<Form.Row>
						<TextInput
							label="Ім'я користувача"
							name="name"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.name}
							touched={touched.name}
							errors={errors.name}
						/>
					</Form.Row>

					<Form.Row>
						<TextInput
							label="По батькові"
							name="middlename"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.middlename}
							touched={touched.middlename}
							errors={errors.middlename}
						/>
					</Form.Row>

					<Form.Row>
						<TextInput
							label="Прізвище"
							name="lastname"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.lastname}
							touched={touched.lastname}
							errors={errors.lastname}
						/>
					</Form.Row>

					{/* User account settings */}
					<Form.Row className="mt-3 py-1 pl-1 border border-warning rounded">
						<Col xs={12}>
							<em className="text-warning">
								Редагуйте ці налаштування з обережністю!
							</em>
						</Col>
						<Col md={6} className="py-1">
							<CheckBox
								type="checkbox"
								id="approved-user-checkbox"
								label="Затверджений обліковий запис користувача"
								name="approvedUser"
								onChange={handleChange}
								onBlur={handleBlur}
								checked={values.approvedUser}
								value={values.approvedUser}
								touched={touched.approvedUser}
								errors={errors.approvedUser}
							/>
						</Col>
						<Col md={6} className="py-1">
							<CheckBox
								type="checkbox"
								id="super-user-checkbox"
								label="Користувач — адміністратор сайту"
								name="superUser"
								onChange={handleChange}
								onBlur={handleBlur}
								checked={values.superUser}
								value={values.superUser}
								touched={touched.superUser}
								errors={errors.superUser}
							/>
						</Col>
					</Form.Row>

					{/* Button */}
					<Form.Row className='pt-4 d-flex justify-content-center text-center'>
						<Form.Group
							as={Col}
							className="mb-0"
						>
							<BtnWithSpinner
								loadingState={processingForm}
								className="px-4 default-width-btn"
								variant="success"
								type="submit"
								label="Зберегти"
								dataCy="edit-user-btn"
							/>
						</Form.Group>
					</Form.Row>
				</Form>
			)}
		</Formik>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		account: state.account
	}
}

const mapDispatchToProps = {
	setNotification,
	updateUser
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserEditForm)
