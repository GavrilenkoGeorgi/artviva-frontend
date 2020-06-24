import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import userService from '../../services/users'

import { Link } from 'react-router-dom'
import { Col, Form, InputGroup, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import ReCaptchaComp from '../common/ReCaptchaComp'
import BtnWithSpinner from '../common/buttons/BtnWithSpinner'
import TextInput from './components/TextInput'
import CheckBox from './components/Checkbox'

const RegisterForm = ({ setNotification, setRegistrationSuccessful, registrationSuccessful }) => {

	const unmounted = useRef(false)
	const [processingForm, setProcessingForm] = useState(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

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

	const handleRegister = ({ email, name, middlename, lastname, password }, setErrors ) => {
		setProcessingForm(true)
		const userCreds = {
			email,
			name,
			middlename,
			lastname: lastname,
			password
		}
		userService.signUp(userCreds)
			.then(() => {
				setNotification({
					message: 'Ви отримаєте електронний лист із посиланням для активації свого акаунта.',
					variant: 'success'
				}, 5)
				setRegistrationSuccessful(true)
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
	}

	// recaptcha
	const reCaptchaRef = React.createRef()
	const [score, setScore] = useState(null)

	const setRecaptchaScore = score => {
		if (!unmounted.current) {
			if (score <= .1) {
				setNotification({
					message: `Ваша оцінка recaptcha занизька: ${score}, спробуйте оновити сторінку.`,
					variant: 'warning'
				}, 5)
			}
			setScore(score)
		}
	}

	const checkboxLabel = () => <>Я погоджуюся з <Link to="#">умовами</Link> використання сайту</>

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
					await handleRegister(values, setErrors)
					if (registrationSuccessful) resetForm()
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
									loadingState={processingForm}
									disabled={score <= .1 ? true : false}
									waitingState={!score}
									label="Реєстрація"
									variant="primary"
									dataCy="register-btn"
									className="primary-color-shadow px-5"
								/>
							</Form.Group>
						</Form.Row>
					</Form>
				)}
			</Formik>
			<ReCaptchaComp
				ref={reCaptchaRef}
				size="invisible"
				render="explicit"
				badge="bottomleft"
				hl="uk"
				setScore={setRecaptchaScore}
			/>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		account: state.account
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RegisterForm)
