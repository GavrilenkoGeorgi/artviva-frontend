import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import userService from '../../services/users'
import searchService from '../../services/search'
import { setNotification,
	setProcessingForm, setFetchingData } from '../../reducers/notificationReducer'
import { updateUser } from '../../reducers/userReducer'
import { Link } from 'react-router-dom'

import { Col, Form } from 'react-bootstrap'

import { Formik } from 'formik'
import * as Yup from 'yup'

import BtnWithSpinner from '../common/buttons/BtnWithSpinner'
import TextInput from './components/TextInput'
import CheckBox from './components/Checkbox'
import { SimpleSpinner } from '../common/spinners'

const UserEditForm = ({
	user, userData, updateUser, processingForm, fetchingData,
	setFetchingData, setNotification, setProcessingForm,
	closeModal, mode }) => {

	const [teachersList, setTeachersList] = useState([])
	const [currentTeacher, setCurrentTeacher] = useState('')

	const successNotification = () => {
		setNotification({
			message: 'Інформація про користувача оновлена.',
			variant: 'success'
		}, 5)
	}

	const errorNotification = useCallback(error => {
		const { message } = { ...error.response.data }
		setNotification({
			message,
			variant: 'danger'
		}, 5)
	}, [setNotification])

	useEffect(() => {
		if (user && userData.teacher) {
			searchService.setToken(user.token)
			searchService.teacherNameById(userData.teacher)
				.then(({ name }) => {
					setCurrentTeacher(name)
				}).catch(error => {
					errorNotification(error)
				})
		}
	}, [userData, user, errorNotification])

	const handleUserDetailsEdit = values => {
		setProcessingForm(true)
		userService.setToken(user.token)
		if (mode === 'single') {
			userService.update(user.id, values)
				.then(() => {
					successNotification()
				})
				.catch(error => {
					errorNotification(error)
				})
				.finally(() => {
					setProcessingForm(false)
					closeModal()
				})
		} else {
			updateUser(userData.id, values)
				.then(() => {
					successNotification()
					closeModal()
				})
				.catch(error => {
					errorNotification(error)
				})
				.finally(() => {
					setProcessingForm(false)
				})
		}
	}

	const getTeachers = (value) => {
		if (value.length >= 2) {
			setFetchingData(true)
			const query = { value }
			searchService.teachers(query)
				.then(teachers => {
					setTeachersList(teachers)
				})
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}

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
		teacher: Yup.string(),
		approvedUser: Yup.bool()
			.oneOf([true, false]),
		superUser: Yup.bool()
			.oneOf([true, false])
	})

	return (
		<Formik
			initialValues={{ ...userData, teacher: currentTeacher || '' }}
			enableReinitialize
			onSubmit={values => {
				handleUserDetailsEdit(values)
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

					{/* Teacher's name input */}
					<Form.Row>
						<Form.Group
							controlId="teacher-name-input"
							as={Col}
						>
							<Form.Label>Ім&apos;я викладача в анкети
								{fetchingData
									? <SimpleSpinner
										className="ml-1"
										animation="grow"
										size="sm"
										variant="primary"
									/>
									: null
								}
							</Form.Label>
							<Form.Control className="border border-warning"
								type="text"
								name="teacher"
								list="teachers-list"
								autoComplete="off"
								data-cy="teacher-name-input"
								onChange={handleChange}
								onKeyUp={event => getTeachers(event.target.value)}
								onBlur={handleBlur}
								value={values.teacher}
								isValid={touched.teacher && !errors.teacher}
								isInvalid={touched.teacher && !!errors.teacher}
							/>
							<datalist id="teachers-list">
								{teachersList.map((name) =>
									<option key={name} value={name} />
								)}
							</datalist>
							<Form.Control.Feedback type="invalid">
								{errors.teacher}
							</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>

					{/* User account settings */}
					<Form.Row className="mt-2 py-2 px-3 border border-warning rounded">
						{user.superUser
							? <>
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
										dataCy="approved-user-checkbox"
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
										label="Користувач — завуч"
										dataCy="super-user-checkbox"
										name="superUser"
										onChange={handleChange}
										onBlur={handleBlur}
										checked={values.superUser}
										value={values.superUser}
										touched={touched.superUser}
										errors={errors.superUser}
									/>
								</Col>
							</>
							: <>
								<em className="text-secondary">
									Щоб застосувати зміни, вам доведеться знову вийти та увійти в систему.
								</em>
								<Link className="py-2" to="/recover">Змінити пароль</Link>
							</>
						}
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

const mapStateToProps = state => {
	return {
		user: state.user,
		processingForm: state.notification.processingForm,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	setFetchingData,
	updateUser
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UserEditForm)
