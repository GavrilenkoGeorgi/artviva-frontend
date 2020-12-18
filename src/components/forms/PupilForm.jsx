import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setFetchingData } from '../../reducers/notificationReducer'
import searchService from '../../services/search'
import moment from 'moment'
import { setPhoneInputFieldValue } from '../../utils/formsUtils'

import { Formik } from 'formik'
import { Col, Form } from 'react-bootstrap'
import { BtnWithSpinner } from '../common/buttons'
import ResetBtn from './buttons/Reset'
import { CheckBox, DateInput, Select,
	TextAreaInput, TextInput } from './components'
import { SimpleSpinner } from '../common/spinners'
import FocusError from './components/FocusError'

import pupilFormSchema from './schemas/pupilFormValidationSchema'

const PupilForm = ({
	user,
	pupil,
	specialties,
	mode,
	handleFormData,
	openInfoModal,
	processingForm,
	fetchingData
}) => {

	const [usersList, setUsersList] = useState([])
	const [editMode, setEditMode] = useState(false)
	const genders = ['Чоловіча', 'Жіноча']
	const classNumbers = ['Дошкільник', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'Студент']
	const artClassNumbers = [1, 2, 3, 4, 5, 6, 7, 8]
	const benefits = [50, 100] // %
	const unmounted = useRef(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	useEffect(() => {
		if (mode === 'edit') setEditMode(true)
		if (pupil && pupil.assignedTo)
			setUsersList([{ email: pupil.assignedTo.email }])
	}, [mode, pupil])

	const getUsers = value => {
		if (value.length >= 2) {
			setFetchingData(true)
			searchService.fullUserNameSearch({ value })
				.then(users => {
					if (users.length) setUsersList(users)
				})
				.finally(() => {
					if (!unmounted.current) setFetchingData(false)
				})
		}
	}

	const showUserName = (email, users) => {
		const user = users.find(user => user.email === email)
		return <span>{user ? <>{user.lastname} {user.name} {user.middlename}</> : ''}</span>
	}

	const initialFormValues = () =>
		mode === 'edit'
			? { ...pupil,
				specialty: pupil.specialty.title,
				dateOfBirth: moment(pupil.dateOfBirth).format('YYYY-MM-DD'),
				assignedTo: pupil.assignedTo ? pupil.assignedTo.email : ''
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
				graduated: false,
				suspended: false,
				info: ''
			}

	return <Formik
		initialValues={initialFormValues()}
		enableReinitialize
		onSubmit={(values, { setErrors, resetForm }) => {
			handleFormData(values, setErrors, resetForm)
		}}
		validationSchema={pupilFormSchema(mode,
			usersList.map(user => user.email),
			specialties)}
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
				id="pupil-form"
				data-cy="pupil-form"
				noValidate
				onSubmit={handleSubmit}
			>
				<p className="pt-2 mb-1 text-muted text-center">
					Дані/інформація про учня
				</p>

				{/* Users email input */}
				{(user && user.superUser && (mode !== 'public'))
					? <Form.Row>
						<Form.Group
							controlId={editMode ? `${pupil.id}-assign-email-input` : 'assign-email-input' }
							as={Col}
						>
							<Form.Label>
								<span  className="text-primary">
									Електронна адреса користувача, якому призначено цього учня
								</span><br />
								<span className="text-muted">
									Пошук здійснюється за прізвищем користувача!
								</span>
								{fetchingData && <SimpleSpinner
									className="ml-1"
									animation="grow"
									size="sm"
									variant="primary"
								/>}
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
								{usersList.map(user =>
									<option key={user.email} value={user.email}>
										{user.lastname} {user.name} {user.middlename}
									</option>
								)}
							</datalist>
							{!errors.assignedTo
								? <>
									<Form.Text className="text-muted">
										{pupil && pupil.assignedTo
											? <>
												{`${pupil.assignedTo.lastname} `}
												{`${pupil.assignedTo.name} `}
												{pupil.assignedTo.middlename}
											</>
											: <>{usersList.length
												? <>{showUserName(values.assignedTo, usersList)}</>
												: 'Наразі цей учень ще не призначений жодному вчителю'}
											</>
										}
									</Form.Text>
								</>
								: <Form.Control.Feedback type="invalid">
									{errors.assignedTo}
								</Form.Control.Feedback>
							}
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
						options={specialties}
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.specialty}
						touched={touched.specialty}
						errors={errors.specialty}
					/>
				</Form.Row>

				{editMode && <Form.Row>
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
					onKeyUp={event => setPhoneInputFieldValue(event, setFieldValue)}
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
					type="email"
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
					onKeyUp={event => setPhoneInputFieldValue(event, setFieldValue)}
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
					onKeyUp={event => setPhoneInputFieldValue(event, setFieldValue)}
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
											Я згоден на <span
												className="checkbox-link"
												onClick={() => openInfoModal('personal-data')}>
												збір та обробку</span> моїх персональних даних
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
											<span
												className="checkbox-link"
												onClick={() => openInfoModal('payment')}>
												Зобов&apos;язання</span> про оплату
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
										? `docs-present-checkbox-${pupil.id}`
										: 'docs-present-checkbox'}
									label="Надав усі необхідні документи"
									name="docsPresent"
									dataCy="docs-present-checkbox"
									onChange={handleChange}
									onBlur={handleBlur}
									checked={values.docsPresent}
									value={values.docsPresent}
									touched={touched.docsPresent}
									errors={errors.docsPresent}
								/>
								<CheckBox
									type="checkbox"
									id={editMode
										? `currently-enrolled-checkbox-${pupil.id}`
										: 'currently-enrolled-checkbox'}
									label="Навчається"
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
										? `graduated-checkbox-${pupil.id}`
										: 'graduated-checkbox'}
									label="Випустився зі школи"
									name="graduated"
									dataCy="graduated-checkbox"
									onChange={handleChange}
									onBlur={handleBlur}
									checked={values.graduated}
									value={values.graduated}
									touched={touched.graduated}
									errors={errors.graduated}
								/>
								<CheckBox
									type="checkbox"
									id={editMode
										? `suspended-checkbox-${pupil.id}`
										: 'suspended-checkbox'}
									label="Відрахований зі школи"
									name="suspended"
									dataCy="suspended-checkbox"
									onChange={handleChange}
									onBlur={handleBlur}
									checked={values.suspended}
									value={values.suspended}
									touched={touched.suspended}
									errors={errors.suspended}
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
						label={mode === 'edit'
							? 'Зберегти'
							: (mode === 'public' ? 'Відправити' : 'Додати')
						}
						variant={mode === 'edit' ? 'success' : 'primary'}
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
				<FocusError formId={'pupil-form'} />
			</Form>
		)}
	</Formik>
}

PupilForm.propTypes = {
	user: PropTypes.object,
	pupil: PropTypes.object,
	specialties: PropTypes.array.isRequired,
	mode: PropTypes.oneOf(['create', 'edit', 'public']).isRequired,
	handleFormData: PropTypes.func.isRequired,
	openInfoModal: PropTypes.func,
	processingForm: PropTypes.bool.isRequired,
	fetchingData: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		fetchingData: state.notification.fetchingData,
		processingForm: state.notification.processingForm
	}
}

const mapDispatchToProps = {
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilForm)
