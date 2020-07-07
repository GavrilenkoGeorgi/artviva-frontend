import React, { useState, useRef, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { setNotification,
	setRecaptchaScore, setProcessingForm } from '../../reducers/notificationReducer'
import userService from '../../services/users'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { personalDataProcessing } from '../../data/formTexts.json'

import { Link } from 'react-router-dom'
import { Col, Form, InputGroup, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import BtnWithSpinner from '../common/buttons/BtnWithSpinner'
import TextInput from './components/TextInput'
import CheckBox from './components/Checkbox'
import { InfoModal } from '../common/modals'

const RegisterForm = ({
	reCaptchaScore,
	processingForm,
	setNotification,
	setRecaptchaScore,
	setProcessingForm }) => {

	const unmounted = useRef(false)
	const [registrationData, setRegistrationData] = useState(null)
	const [infoModalVis, setInfoModalVis] = useState(false)
	const { executeRecaptcha } = useGoogleReCaptcha()

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const getRecaptchaScore = () => {
		executeRecaptcha('submit')
			.then(token => {
				setRecaptchaScore(token)
			})
			.catch(error => {
				const { message, variant } = { ...error.response.data }
				setNotification({
					message,
					variant: variant ? variant : 'danger'
				}, 5)
			})
	}

	const handleRegister = useCallback(() => {
		setProcessingForm(true)
		const { user, setErrors } = registrationData

		userService.signUp(user)
			.then(() => {
				setNotification({
					message: 'Ви отримаєте електронний лист із посиланням для активації свого акаунта.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message, cause } = { ...error.response.data }
				if (cause === 'email') {
					setErrors({ email: message })
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
	}, [setNotification, setProcessingForm, registrationData])

	useEffect(() => {
		if (reCaptchaScore !== null && reCaptchaScore < .5) {
			setNotification({
				message: 'Ваша оцінка reCAPTCHA занизька, спробуйте оновити сторінку.',
				variant: 'warning'
			}, 5)
			setProcessingForm(false)
		} else if (registrationData && reCaptchaScore >= .5) {
			handleRegister(registrationData)
		}
	}, [reCaptchaScore, registrationData, handleRegister, setNotification, setProcessingForm])

	// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
	const mediumStrPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

	const registerFormSchema = Yup.object().shape({
		email: Yup.string()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть свою електронну пошту.'),
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
		password: Yup.string()
			.min(8, 'Мінімум 8 символів.')
			.matches(mediumStrPass,
				'Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число.')
			.required('Будь ласка, введіть свій пароль.'),
		passwordConfirm: Yup.string()
			.min(8, 'Мінімум 8 символів.')
			.matches(mediumStrPass,
				'Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число.')
			.required('Будь ласка, введіть підтвердження свого пароля.')
			.when('password', {
				is: value => value && value.length > 0,
				then: Yup.string()
					.oneOf([Yup.ref('password')], 'Обидва паролі повинні бути однаковими.')
			}),
		termsCheckbox: Yup.boolean()
			.oneOf([true], 'Будь ласка, погодьтеся з умовами використання сайту.')
	})

	const checkboxLabel = () =>
		<>Я погоджуюся з <Link to="#" onClick={() => setInfoModalVis(true)}>умовами</Link> використання сайту</>

	// password visibility
	const [passHidden, setPassVis] = useState(false)
	const [passConfirmHidden, setPassConfirmVis] = useState(false)

	const togglePassFieldType = field => {
		switch (field) {
		case 'pass' :
			setPassVis(!passHidden)
			break
		case 'passConfirm' :
			setPassConfirmVis(!passConfirmHidden)
			break
		default:
			return null
		}
	}

	return (
		<>
			<Formik
				initialValues={{
					email: '',
					name: '',
					middlename: '',
					lastname: '',
					password: '',
					passwordConfirm: '',
					termsCheckbox: false
				}}
				onSubmit={async (values, { resetForm, setErrors }) => {
					const user = {};
					({ email: user.email,
						name: user.name,
						middlename: user.middlename,
						lastname: user.lastname,
						password: user.password } = values)
					setProcessingForm(true)
					setRegistrationData({ user, resetForm, setErrors })
					getRecaptchaScore()
				}}
				validationSchema={registerFormSchema}
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

						{/* User email input */}
						<TextInput
							type="email"
							label="Ваша електронна пошта"
							name="email"
							placeholder="Ваш майбутній логін"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.email}
							touched={touched.email}
							errors={errors.email}
						/>

						{/* User name input */}
						<TextInput
							label="Ваше ім'я"
							name="name"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.name}
							touched={touched.name}
							errors={errors.name}
						/>

						{/* User middle name input */}
						<TextInput
							label="По батькові"
							name="middlename"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.middlename}
							touched={touched.middlename}
							errors={errors.middlename}
						/>

						{/* User last name input */}
						<TextInput
							label="Прізвище"
							name="lastname"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.lastname}
							touched={touched.lastname}
							errors={errors.lastname}
						/>

						{/* User password input */}
						<Form.Row className="d-flex justify-content-center">
							<Form.Group
								controlId="user-pass-input"
								as={Col}
							>
								<Form.Label>
									Ваш пароль
								</Form.Label>
								<InputGroup>
									<Form.Control
										className="elevated-z-index"
										type={passHidden ? 'text' : 'password'}
										name="password"
										data-cy="password-input"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.password}
										isValid={touched.password && !errors.password}
										isInvalid={touched.password && !!errors.password}
									/>
									<InputGroup.Append>
										<Button
											variant="outline-secondary border rounded-right"
											onClick={() => togglePassFieldType('pass')}
										>
											{passHidden
												? <FontAwesomeIcon icon={faEye} />
												: <FontAwesomeIcon icon={faEyeSlash} />
											}
										</Button>
									</InputGroup.Append>
									<Form.Control.Feedback type="invalid">
										{errors.password}
									</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>
						</Form.Row>

						{/* User password confirmation input */}
						<Form.Row className="d-flex justify-content-center">
							<Form.Group
								controlId="user-pass-confirm-input"
								as={Col}
							>
								<Form.Label>
									Підтвердження пароля
								</Form.Label>
								<InputGroup>
									<Form.Control
										className="elevated-z-index"
										type={passConfirmHidden ? 'text' : 'password'}
										name="passwordConfirm"
										data-cy="password-confirm-input"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.passwordConfirm}
										isValid={touched.passwordConfirm && !errors.passwordConfirm}
										isInvalid={touched.passwordConfirm && !!errors.passwordConfirm}
									/>
									<InputGroup.Append>
										<Button
											variant="outline-secondary border rounded-right"
											onClick={() => togglePassFieldType('passConfirm')}
										>
											{passConfirmHidden
												? <FontAwesomeIcon icon={faEye} />
												: <FontAwesomeIcon icon={faEyeSlash} />
											}
										</Button>
									</InputGroup.Append>
									<Form.Control.Feedback type="invalid">
										{errors.passwordConfirm}
									</Form.Control.Feedback>
								</InputGroup>
							</Form.Group>
						</Form.Row>

						{/* Checkbox */}
						<CheckBox
							type="checkbox"
							id="terms-checkbox"
							label={checkboxLabel()}
							name="termsCheckbox"
							dataCy="terms-checkbox"
							onChange={handleChange}
							onBlur={handleBlur}
							checked={values.termsCheckbox}
							value={values.termsCheckbox}
							touched={touched.termsCheckbox}
							errors={errors.termsCheckbox}
						/>

						{/* Button */}
						<Form.Row className='d-flex justify-content-center text-center'>
							<Form.Group
								as={Col}
							>
								<BtnWithSpinner
									type="submit"
									block
									loadingState={processingForm}
									disabled={reCaptchaScore !==null && reCaptchaScore <= .5 ? true : false}
									label="Реєстрація"
									variant="primary"
									dataCy="register-btn"
									className="primary-color-shadow my-3"
								/>
							</Form.Group>
						</Form.Row>
					</Form>
				)}
			</Formik>
			<InfoModal
				title="Я погоджуюся з умовами використання сайту"
				text={personalDataProcessing}
				centered
				show={infoModalVis}
				onHide={() => setInfoModalVis(!infoModalVis)}
			/>
		</>
	)
}

const mapStateToProps = state => {
	return {
		reCaptchaScore: state.notification.reCaptchaScore,
		processingForm: state.notification.processingForm
	}
}

const mapDispatchToProps = {
	setNotification,
	setRecaptchaScore,
	setProcessingForm
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterForm)
