import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setNotification } from '../../reducers/notificationReducer'
import { createPupil, updatePupil } from '../../reducers/pupilsReducer'
import pupilsService from '../../services/pupils'
import specialtyService from '../../services/specialties'
import { findByPropertyValue } from '../../utils/arrayHelpers'
import { phoneNumber } from '../../utils/stringPatterns'
import { formatPhoneNumber } from '../../utils/formatPhoneNumber'
import { trimObject } from '../../utils/objectHelpers'
import moment from 'moment'

import { Formik } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'

import { Container, Col, Form } from 'react-bootstrap'
import BtnWithSpinner from '../common/BtnWithSpinner'
import ResetBtn from './buttons/Reset'
import TextInput from './components/TextInput'
import TextAreaInput from './components/TextAreaInput'
import Select from './components/Select'
import DateInput from './components/DateInput'
import CheckBox from './components/Checkbox'

const PupilForm = ({
	pupil,
	user,
	setNotification,
	createPupil,
	updatePupil,
	mode,
	closeModal }) => {

	const history = useHistory()
	const [editMode, setEditMode] = useState(false)
	const [processingForm, setProcessingForm] = useState(false)
	const [specialtiesNames, setSpecialtiesNames] = useState([])
	const [specialtiesData, setSpecialtiesData] = useState([])
	const genders = ['Чоловіча', 'Жіноча']
	const classNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	const artClassNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
	const benefits = [0, 50, 100] // %

	// set auth token and mode
	useEffect(() => {
		if (user) pupilsService.setToken(user.token)
		if (mode === 'edit') setEditMode(true)
	}, [user, mode])

	useEffect(() => {
		specialtyService.getAll()
			.then(data => {
				setSpecialtiesData(data)
				setSpecialtiesNames(data.map(specialty => specialty.title))
			})
			.catch(error => console.error(error))
	}, [])

	// handle edit or create
	const handlePupil = (values, setErrors, resetForm) => {
		// replace human readable specialty with id
		const { id } = findByPropertyValue(values.specialty, 'title', specialtiesData)
		values = { ...values,	specialty: id }
		if (editMode) values = { ...values, schoolClasses: values.schoolClasses.map(item => item.id) }

		setProcessingForm(true)
		editMode
			? editPupil(trimObject(values), setErrors)
			: (mode === 'create'
				? addPupil(trimObject((values), setErrors, resetForm))
				: publicApply(trimObject(values), setErrors, resetForm))
	}

	const publicApply = (values, setErrors, resetForm) => {
		// this one is a little different
		pupilsService.publicApply(values)
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
					setErrors({ title: message })
				}
				setNotification({
					message,
					variant: 'danger'
				}, 5)
				setProcessingForm(false)
			})
	}

	const addPupil = (values, setErrors, resetForm) => {
		createPupil(values)
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
					setErrors({ title: message })
				}
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingForm(false))
	}

	const editPupil = (values, setErrors) => {
		updatePupil(pupil.id, values)
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
					setErrors({ title: message })
				}
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingForm(false))
	}

	// form data and schema
	const initialFormValues = () =>
		editMode
			? { ...pupil,
				specialty: pupil.specialty.title,
				dateOfBirth: moment(pupil.dateOfBirth).format('YYYY-MM-DD')
			}
			: { name: '',
				applicantName: '',
				specialty: '',
				artSchoolClass: 1,
				dateOfBirth: '',
				mainSchool: '',
				mainSchoolClass: '',
				gender: '',
				hasBenefit: '',
				fathersName: '',
				fathersPhone: '',
				fathersEmploymentInfo: '',
				mothersName: '',
				mothersPhone: '',
				mothersEmploymentInfo: '',
				contactEmail: '',
				homeAddress: '',
				docsCheck: false,
				processDataCheck: false,
				paymentObligationsCheck: false,
				docsPresent: false,
				currentlyEnrolled: false,
				info: ''
			}

	const pupilFormSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повнe ім\'я.'),
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
			.min(1)
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
			.matches(phoneNumber, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX')
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
			.matches(phoneNumber, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX')
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
		docsCheck: Yup.bool()
			.oneOf([true]),
		processDataCheck: Yup.bool()
			.oneOf([true]),
		paymentObligationsCheck: Yup.bool()
			.oneOf([true]),
		docsPresent: Yup.bool()
			.oneOf([true, false]),
		currentlyEnrolled: Yup.bool()
			.oneOf([true, false]),
		info: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(255, 'Максимум 255 символів.')
	})

	return (
		<Container>
			<Formik
				initialValues={initialFormValues()}
				enableReinitialize
				onSubmit={(values, { resetForm, setErrors }) => {
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
						<TextInput
							label="Повне ім'я учня"
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
								name="hasBenefit"
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
											label="Я зобов'язаний надати ці документи шкільному відділу"
											name="docsCheck"
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
												Медічна довідка про відсутність противопоказань до занять обраним фахом.
											</li>
										</ol>
									</Col>
									<Col xs={12} className="py-2">
										<CheckBox
											type="checkbox"
											id="personal-data-checkbox"
											label="Я згоден на збір та обробку моїх персональних даних"
											name="processDataCheck"
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
											label="Зобов'язання про оплату"
											name="paymentObligationsCheck"
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
							className="pt-4 px-0 d-flex justify-content-end"
						>
							<BtnWithSpinner
								label={editMode
									? 'Зберегти'
									: (mode === 'public' ? 'Відправити' : 'Додати')
								}
								variant={editMode ? 'success' : 'primary'}
								type="submit"
								loadingState={processingForm}
								dataCy="add-pupil-btn"
								className="default-width-btn"
							/>
							<ResetBtn
								label="Очистити"
								variant="light"
								onClick={handleReset}
								className="ml-2 default-width-btn"
							/>
						</Form.Group>
					</Form>
				)}
			</Formik>
		</Container>
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
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification,
	createPupil,
	updatePupil
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilForm)
