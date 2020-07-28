import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { setNotification, setFetchingData } from '../../reducers/notificationReducer'
import { createPupil, updatePupil } from '../../reducers/pupilsReducer'
import pupilsService from '../../services/pupils'
import specialtyService from '../../services/specialties'
import searchService from '../../services/search'
import moment from 'moment'
import { paymentObligations,
	personalDataProcessing, benefitsExplained } from '../../data/formTexts.json'
import { phoneNumber as phonePattern,
	formatPhoneNumber, trimObject } from '../../utils'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { Col, Form } from 'react-bootstrap'
import { BtnWithSpinner } from '../common/buttons'
import ResetBtn from './buttons/Reset'
import { CheckBox, DateInput, Select,
	TextAreaInput, TextInput } from './components'
import { InfoModal } from '../common/modals'
import { SimpleSpinner } from '../common/spinners'

const PupilForm = ({
	pupil,
	user,
	setNotification,
	createPupil,
	updatePupil,
	fetchingData,
	mode,
	closeModal }) => {

	const history = useHistory()
	const unmounted = useRef(false)
	const [usersList, setUsersList] = useState([])
	const [assignedTo, setAssignedTo] = useState('')
	const [editMode, setEditMode] = useState(false)
	const [createMode, setCreateMode] = useState(false)
	const [processingForm, setProcessingForm] = useState(false)
	const [specialtiesNames, setSpecialtiesNames] = useState([])
	const [specialtiesData, setSpecialtiesData] = useState([])
	const [infoModalVis, setInfoModalVis] = useState(false)
	const [infoModalText, setInfoModalText] = useState({})
	const [infoModalTitle, setInfoModalTitle] = useState('')
	const genders = ['Чоловіча', 'Жіноча']
	const classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	const artClassNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
	const benefits = [50, 100] // %

	// set auth token and mode
	useEffect(() => {
		if (user) pupilsService.setToken(user.token)
		if (mode === 'edit') {
			setEditMode(true)
		} else if (mode === 'create') {
			setCreateMode(true)
		}
	}, [user, mode])

	useEffect(() => {
		if (pupil && pupil.assignedTo) {
			searchService.userEmailById(pupil.assignedTo)
				.then(email => {
					setAssignedTo(email)
				})
				.catch(error => {
					console.error(error)
				})
		}
	}, [pupil])

	useEffect(() => {
		specialtyService.getAll()
			.then(data => {
				setSpecialtiesData(data)
				setSpecialtiesNames(data.map(specialty => specialty.title))
			})
			.catch(error => console.error(error))
		return () => { unmounted.current = true }
	}, [])

	// handle edit or create
	const handlePupil = async (values, setErrors, resetForm) => {

		// replace human readable specialty title with id
		const { id: specialty } = specialtiesData.find(specialty => specialty.title === values.specialty)
		values = { ...values,
			specialty
		}

		// all this looks ugly
		if (values.assignedTo) {
			const users = await searchService.users({ value: values.assignedTo })
			const { id: assignedTo } = users.find(user => user.email === values.assignedTo)
			if (assignedTo) values = { ...values, assignedTo }
		}

		if (editMode) values = { ...values,
			schoolClasses: values.schoolClasses.map(item => item.id),
		}

		console.log('Sending this', values)

		setProcessingForm(true)
		editMode
			? editPupil(trimObject(values), setErrors)
			: (mode === 'create'
				? addPupil(trimObject(values), setErrors, resetForm)
				: publicApply(trimObject(values), setErrors, resetForm))
	}

	const publicApply = (values, setErrors, resetForm) => {
		// this one is a little different
		// remove assignedTo, as it is a public form
		// eslint-disable-next-line
		const { assignedTo, ...valuesToSend } = values
		pupilsService.publicApply(valuesToSend)
			.then(() => {
				setNotification({
					message: 'Ваша заява була успішно додана.',
					variant: 'success'
				}, 5)
				setProcessingForm(false)
				resetForm()
				history.push('/apply/success')
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
				if (!unmounted.current) {
					setProcessingForm(false)
				}
			})
	}

	const addPupil = (values, setErrors, resetForm) => {
		const valuesToSend = { ...values, assignedTo: user.id }
		createPupil(valuesToSend)
			.then(() => {
				setNotification({
					message: 'Новий учень був успішно додан.',
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
			.finally(() => {
				if (!unmounted.current) {
					setProcessingForm(false)
				}
			})
	}

	const editPupil = (values, setErrors) => {
		// remove teachers and schoolClasses
		// as they are not updated through this
		// instance of the form
		// eslint-disable-next-line
		const { teachers, schoolClasses, ...valuesToSend } = values
		updatePupil(pupil.id, valuesToSend)
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
				closeModal()
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
			.finally(() => {
				if (!unmounted.current) {
					setProcessingForm(false)
				}
			})
	}

	const getUsers = value => {
		if (value.length >= 2) {
			setFetchingData(true)
			const query = { value }
			searchService.users(query)
				.then(users => {
					setUsersList(users)
					// console.log(users)
				})
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'warning'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}

	const openInfoModal = type => {
		let title
		switch (type) {
		case 'personal-data':
			title = 'Я згоден на збір та обробку моїх персональних даних'
			setInfoModalText(personalDataProcessing)
			break
		case 'payment':
			title = 'Зобов\'язання про оплату'
			setInfoModalText(paymentObligations)
			break
		case 'benefits':
			title = 'Пільги на навчання'
			setInfoModalText(benefitsExplained)
			break
		default:
			break
		}
		setInfoModalTitle(title)
		setInfoModalVis(true)
	}

	// form data and schema
	const initialFormValues = () =>
		editMode
			? { ...pupil,
				specialty: pupil.specialty.title,
				dateOfBirth: moment(pupil.dateOfBirth).format('YYYY-MM-DD'),
				assignedTo: assignedTo
			}
			: { assignedTo: '',
				name: '',
				applicantName: '',
				specialty: '',
				artSchoolClass: 1,
				dateOfBirth: '',
				mainSchool: '',
				mainSchoolClass: '',
				gender: '',
				hasBenefit: 0,
				fathersName: '',
				fathersPhone: '',
				fathersEmploymentInfo: '',
				mothersName: '',
				mothersPhone: '',
				mothersEmploymentInfo: '',
				contactEmail: '',
				homeAddress: '',
				phoneNumber: '',
				docsCheck: false,
				processDataCheck: false,
				paymentObligationsCheck: false,
				docsPresent: false,
				currentlyEnrolled: false,
				info: ''
			}

	const pupilFormSchema = Yup.object().shape({
		assignedTo: Yup.string()
			.email('Адреса електронної пошти недійсна.'),
		name: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть прізвище та повне ім\'я учня.'),
		applicantName: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повнe ім\'я.'),
		specialty: Yup.string()
			.oneOf(specialtiesNames, 'Виберіть фах учня.')
			.required('Виберіть фах.'),
		artSchoolClass: Yup.number()
			.min(1, 'Перший або восьмий.')
			.max(8, 'Перший або восьмий.')
			.typeError('У якому класи навчается?'),
		dateOfBirth: Yup.date()
			.min(new Date(1950, 0, 1), 'Занадто старий.')
			.max(new Date(2019, 0, 1), 'Занадто молодий.')
			.required('Введіть дату народження.'),
		mainSchool: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(255, 'Максимум 255 символів.')
			.required('Введіть основну адресу школи.'),
		mainSchoolClass: Yup.number()
			.min(1, 'Введіть поточний клас.')
			.max(11)
			.required('Введіть поточний клас.'),
		gender: Yup.string()
			.oneOf(genders, 'Виберіть стать.')
			.required('Виберіть стать своєї дитини.'),
		hasBenefit: Yup.number()
			.min(0)
			.max(100),
		fathersName: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повнe ім\'я.'),
		fathersPhone: Yup.string()
			.min(3, 'Не менш 19 символів.')
			.max(19, 'Максимум 19 символів.')
			.matches(phonePattern, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX')
			.required('Введіть номер телефону.'),
		fathersEmploymentInfo: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Місто, вулиця, назва організації, посада.'),
		mothersName: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повнe ім\'я.'),
		mothersPhone: Yup.string()
			.min(3, 'Не менш 19 символів.')
			.max(19, 'Максимум 19 символів.')
			.matches(phonePattern, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX')
			.required('Введіть номер телефону.'),
		mothersEmploymentInfo: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Місто, вулиця, назва організації, посада.'),
		contactEmail: Yup.string()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть електронну пошту.'),
		homeAddress: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть домашню адресу.'),
		phoneNumber: Yup.string()
			.min(3, 'Не менш 19 символів.')
			.max(19, 'Максимум 19 символів.')
			.matches(phonePattern, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX'),
		// this doesn't spark joy ((
		// next three fields are not present
		// in the teacher view form
		// but are needed in schema
		docsCheck: Yup.bool().test(value => {
			if (createMode) {
				const schema = Yup.bool().oneOf([true, false])
				return schema.isValidSync(value)
			} else {
				const schema = Yup.bool().oneOf([true])
				return schema.isValidSync(value)
			}
		}),
		processDataCheck: Yup.bool().test(value => {
			if (createMode) {
				const schema = Yup.bool().oneOf([true, false])
				return schema.isValidSync(value)
			} else {
				const schema = Yup.bool().oneOf([true])
				return schema.isValidSync(value)
			}
		}),
		paymentObligationsCheck: Yup.bool().test(value => {
			if (createMode) {
				const schema = Yup.bool().oneOf([false])
				return schema.isValidSync(value)
			} else {
				const schema = Yup.bool().oneOf([true])
				return schema.isValidSync(value)
			}
		}),
		docsPresent: Yup.bool()
			.oneOf([true, false]),
		currentlyEnrolled: Yup.bool()
			.oneOf([true, false]),
		info: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(255, 'Максимум 255 символів.')
	})

	return (
		<>
			<Formik
				initialValues={initialFormValues()}
				enableReinitialize
				onSubmit={async (values, { setErrors, resetForm }) => {
					handlePupil(values, setErrors, resetForm)
				}}
				validationSchema={pupilFormSchema}
			>
				{({ handleSubmit,
					handleChange,
					handleBlur,
					setFieldValue,
					handleReset,
					values,
					touched,
					errors
				}) => (
					<Form
						data-cy="pupil-form"
						noValidate
						onSubmit={handleSubmit}
					>
						<p className="pt-2 mb-1 text-muted text-center">
							Дані/інформація про учня
						</p>

						{/* Users email input */}
						{(user && user.superUser)
							? <Form.Row>
								<Form.Group
									controlId={editMode ? `${pupil.id}-assign-email-input` : 'assign-email-input' }
									as={Col}
								>
									<Form.Label className="text-primary">
										Електронна адреса користувача, якому призначено цього учня
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
										name="assignedTo"
										list={editMode ? `${pupil.id}-assignedTo-list` : 'assignedTo-list' }
										autoComplete="off"
										data-cy="assignedTo-input"
										onChange={handleChange}
										onKeyUp={event => getUsers(event.target.value)}
										onBlur={handleBlur}
										value={values.assignedTo}
										isValid={touched.assignedTo && !errors.assignedTo}
										isInvalid={touched.assignedTo && !!errors.assignedTo}
									/>
									<datalist id={editMode ? `${pupil.id}-assignedTo-list` : 'assignedTo-list' }>
										{usersList.map((user) =>
											<option key={user.email} value={user.email} >
												{user.name} {user.lastname}
											</option>
										)}
									</datalist>
									<Form.Control.Feedback type="invalid">
										{errors.assignedTo}
									</Form.Control.Feedback>
								</Form.Group>
							</Form.Row>
							: null
						}

						<TextInput
							label="Прізвище та повне ім'я учня"
							name="name"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.name}
							touched={touched.name}
							errors={errors.name}
						/>

						<Form.Row>
							<Select
								label="Фах"
								name="specialty"
								options={specialtiesNames}
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.specialty}
								touched={touched.specialty}
								errors={errors.specialty}
							/>
						</Form.Row>

						{editMode
							? <Form.Row>
								<Select
									label="Рік навчання у ДШМ"
									name="artSchoolClass"
									options={artClassNumbers}
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.artSchoolClass || ''}
									touched={touched.artSchoolClass}
									errors={errors.artSchoolClass}
								/>
							</Form.Row>
							: null
						}

						<Form.Row>
							<Select
								label="Стать"
								name="gender"
								options={genders}
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.gender}
								touched={touched.gender}
								errors={errors.gender}
							/>

							<DateInput
								label="Дата народження"
								name="dateOfBirth"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.dateOfBirth}
								touched={touched.dateOfBirth}
								errors={errors.dateOfBirth}
							/>
						</Form.Row>

						<Form.Row>
							<Select
								label="Клас ЗОШ"
								name="mainSchoolClass"
								options={classNumbers}
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.mainSchoolClass}
								touched={touched.mainSchoolClass}
								errors={errors.mainSchoolClass}
							/>

							<Select
								label="Пільги %"
								placeholder="Немає"
								infoBtn
								showInfo={() => openInfoModal('benefits')}
								name="hasBenefit"
								required={false}
								options={benefits}
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.hasBenefit}
								touched={touched.hasBenefit}
								errors={errors.hasBenefit}
							/>
						</Form.Row>

						<TextInput
							label="В якому закладі навчается"
							name="mainSchool"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.mainSchool}
							touched={touched.mainSchool}
							errors={errors.mainSchool}
						/>

						<TextInput
							label="Домашня адреса"
							name="homeAddress"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.homeAddress}
							touched={touched.homeAddress}
							errors={errors.homeAddress}
						/>

						<TextInput
							label="Телефонний номер учня"
							name="phoneNumber"
							required={false}
							onChange={handleChange}
							onKeyUp={event => formatPhoneNumber(event, 'phoneNumber', setFieldValue)}
							onBlur={handleBlur}
							value={values.phoneNumber}
							touched={touched.phoneNumber}
							errors={errors.phoneNumber}
						/>

						<TextInput
							label="Ім'я особи, яка звертається із заявою"
							name="applicantName"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.applicantName}
							touched={touched.applicantName}
							errors={errors.applicantName}
						/>

						<TextInput
							label="Контактна електронна пошта"
							name="contactEmail"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.contactEmail}
							touched={touched.contactEmail}
							errors={errors.contactEmail}
						/>

						<p className="pt-2 mb-1 text-muted text-center">
							Дані/інформація о батьках
						</p>

						<TextInput
							label="Ім'я батька"
							name="fathersName"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.fathersName}
							touched={touched.fathersName}
							errors={errors.fathersName}
						/>

						<TextInput
							label="Телефонний номер батька"
							name="fathersPhone"
							onChange={handleChange}
							onKeyUp={event => formatPhoneNumber(event, 'fathersPhone', setFieldValue)}
							onBlur={handleBlur}
							value={values.fathersPhone}
							touched={touched.fathersPhone}
							errors={errors.fathersPhone}
						/>

						<TextInput
							label="Місце роботи батька"
							name="fathersEmploymentInfo"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.fathersEmploymentInfo}
							touched={touched.fathersEmploymentInfo}
							errors={errors.fathersEmploymentInfo}
						/>

						<TextInput
							label="Ім'я матері"
							name="mothersName"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.mothersName}
							touched={touched.mothersName}
							errors={errors.mothersName}
						/>

						<TextInput
							label="Телефонний номер матері"
							name="mothersPhone"
							onChange={handleChange}
							onKeyUp={event => formatPhoneNumber(event, 'mothersPhone', setFieldValue)}
							onBlur={handleBlur}
							value={values.mothersPhone}
							touched={touched.mothersPhone}
							errors={errors.mothersPhone}
						/>

						<TextInput
							label="Місце роботи матері"
							name="mothersEmploymentInfo"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.mothersEmploymentInfo}
							touched={touched.mothersEmploymentInfo}
							errors={errors.mothersEmploymentInfo}
						/>

						<Form.Row>
							{mode === 'public'
								? <>
									<Col xs={12} className="pt-4">
										<CheckBox
											type="checkbox"
											id="docs-checkbox"
											label="Я зобов'язаний надати ці документи адміністрації школи"
											name="docsCheck"
											dataCy="docs-checkbox"
											onChange={handleChange}
											onBlur={handleBlur}
											checked={values.docsCheck}
											value={values.docsCheck}
											touched={touched.docsCheck}
											errors={errors.docsCheck}
										/>
										<ol style={{ marginBottom: '0rem', paddingLeft: '2.5rem' }}>
											<li>
												Копія свідоцтва про народження
											</li>
											<li>
												Медична довідка про відсутність протипоказань до занять у закладі
											</li>
										</ol>
									</Col>
									<Col xs={12} className="py-2">
										<CheckBox
											type="checkbox"
											id="personal-data-checkbox"
											label={
												<>
													Я згоден на <Link to="#"
														className="checkbox-link"
														onClick={() => openInfoModal('personal-data')}>
														збір та обробку</Link> моїх персональних даних
												</>
											}
											name="processDataCheck"
											dataCy="personal-data-checkbox"
											onChange={handleChange}
											onBlur={handleBlur}
											checked={values.processDataCheck}
											value={values.processDataCheck}
											touched={touched.processDataCheck}
											errors={errors.processDataCheck}
										/>
									</Col>
									<Col xs={12} className="py-2">
										<CheckBox
											type="checkbox"
											id="payment-checkbox"
											label={
												<>
													<Link to="#"
														className="checkbox-link"
														onClick={() => openInfoModal('payment')}>
														Зобов&apos;язання</Link> про оплату
												</>
											}
											name="paymentObligationsCheck"
											dataCy="payment-checkbox"
											onChange={handleChange}
											onBlur={handleBlur}
											checked={values.paymentObligationsCheck}
											value={values.paymentObligationsCheck}
											touched={touched.paymentObligationsCheck}
											errors={errors.paymentObligationsCheck}
										/>
									</Col>
								</>
								: <>
									<Col xs={12} className="pt-3">
										<CheckBox
											type="checkbox"
											id={editMode
												? `currently-enrolled-checkbox-${pupil.id}`
												: 'currently-enrolled-checkbox'}
											label="Зарахований до школи на навчання."
											name="currentlyEnrolled"
											dataCy="currently-enrolled-checkbox"
											onChange={handleChange}
											onBlur={handleBlur}
											checked={values.currentlyEnrolled}
											value={values.currentlyEnrolled}
											touched={touched.currentlyEnrolled}
											errors={errors.currentlyEnrolled}
										/>
										<CheckBox
											type="checkbox"
											id={editMode
												? `docs-present-checkbox-${pupil.id}`
												: 'docs-present-checkbox'}
											label="Надав усі необхідні документи."
											name="docsPresent"
											dataCy="docs-present-checkbox"
											onChange={handleChange}
											onBlur={handleBlur}
											checked={values.docsPresent}
											value={values.docsPresent}
											touched={touched.docsPresent}
											errors={errors.docsPresent}
										/>
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
									</Col>
								</>
							}
						</Form.Row>

						{/* Button */}
						<Form.Group
							as={Col}
							className="pt-4 px-0 d-flex justify-content-around"
						>
							<BtnWithSpinner
								type="submit"
								label={editMode
									? 'Зберегти'
									: (mode === 'public' ? 'Відправити' : 'Додати')
								}
								variant={editMode ? 'success' : 'primary'}
								loadingState={processingForm}
								dataCy="add-pupil-btn"
								className="default-width-btn"
							/>
							<ResetBtn
								block
								label="Очистити"
								variant="light"
								dataCy="reset-pupil-form-btn"
								onClick={handleReset}
								className="ml-2 default-width-btn"
							/>
						</Form.Group>
					</Form>
				)}
			</Formik>
			<InfoModal
				title={infoModalTitle}
				text={infoModalText}
				centered
				show={infoModalVis}
				onHide={() => setInfoModalVis(!infoModalVis)}
			/>
		</>
	)
}

PupilForm.propTypes = {
	pupil: PropTypes.object,
	user: PropTypes.object,
	setNotification: PropTypes.func.isRequired,
	createPupil: PropTypes.func.isRequired,
	updatePupil: PropTypes.func.isRequired,
	mode: PropTypes.oneOf(['create', 'edit', 'public']).isRequired,
	closeModal: PropTypes.func
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setNotification,
	createPupil,
	updatePupil,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilForm)
