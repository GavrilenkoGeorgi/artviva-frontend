import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { login } from '../../reducers/loginReducer'
import { setNotification, setRecaptchaScore, clearRecaptchaScore,
	setProcessingForm } from '../../reducers/notificationReducer'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { Container, Col, Form, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { BtnWithSpinner } from '../common/buttons'

const LoginForm = ({
	user,
	login,
	reCaptchaScore,
	processingForm,
	setNotification,
	setRecaptchaScore,
	clearRecaptchaScore,
	setProcessingForm }) => {

	const unmounted = useRef(false)
	const history = useHistory()
	const [loginSuccessful, setLoginSuccessful] = useState(false)
	const [loginValues, setLoginValues] = useState(null)
	const { executeRecaptcha } = useGoogleReCaptcha()

	useEffect(() => {
		if (loginSuccessful) {
			history.push('/school')
		}
	}, [loginSuccessful, history, user])

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const getRecaptchaScore = () => {
		executeRecaptcha('login')
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

	const loginUser = useCallback(loginValues => {
		login(loginValues)
			.then(() => {
				setNotification({
					message: 'Вхід вдалий.',
					variant: 'info'
				}, 5)
				setLoginSuccessful(true)
			})
			.catch(error => {
				const { message, variant } = { ...error.response.data }
				setNotification({
					message,
					variant: variant ? variant : 'danger'
				}, 5)
				clearRecaptchaScore()
			})
			.finally(() => {
				if (!unmounted.current) {
					setProcessingForm(false)
				}
			})
	}, [login, setNotification, setProcessingForm, clearRecaptchaScore])

	useEffect(() => {
		if (loginValues && reCaptchaScore >= .3) {
			loginUser(loginValues)
		}
	}, [reCaptchaScore, loginValues, loginUser])

	// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
	const mediumStrPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

	const loginFormSchema = Yup.object().shape({
		email: Yup.string()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть свою електронну пошту.'),
		password: Yup.string()
			.min(8, 'Мінімум 8 символів.')
			.matches(mediumStrPass,
				'Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число.')
			.required('Будь ласка, введіть свій пароль.')
	})

	// password visibility
	const [passHidden, setPassVis] = useState(false)

	const togglePassVis = () => {
		setPassVis(!passHidden)
		let passInput = document.getElementById('login-pass')
		if (passHidden) {
			passInput.type = 'password'
		} else {
			passInput.type = 'text'
		}
	}

	return (
		<>
			<Container>
				<h1 className="text-center custom-font py-4">
					Логін
				</h1>
				<Formik
					initialValues={{
						email: '',
						password: ''
					}}
					onSubmit={async (values) => {
						setProcessingForm(true)
						setLoginValues(values)
						getRecaptchaScore()
					}}
					validationSchema={loginFormSchema}
				>
					{({ handleSubmit,
						handleChange,
						handleBlur,
						values,
						touched,
						errors
					}) => (
						<Form
							data-cy="login-form"
							noValidate
							onSubmit={handleSubmit}
						>

							{/* Message sender email input */}
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>
										Ваша електронна пошта
									</Form.Label>
									<Form.Control
										type="email"
										name="email"
										data-cy="email-input"
										onChange={handleChange}
										onBlur={handleBlur}
										value={values.email}
										isValid={touched.email && !errors.email}
										isInvalid={touched.email && !!errors.email}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.email}
									</Form.Control.Feedback>
								</Form.Group>
							</Form.Row>

							{/* User password input */}
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>
										Ваш пароль
									</Form.Label>
									<InputGroup>
										<Form.Control
											id="login-pass"
											className="elevated-z-index"
											type="password"
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
												onClick={() => togglePassVis()}
											>
												{passHidden
													? <FontAwesomeIcon icon={faEyeSlash} />
													: <FontAwesomeIcon icon={faEye} />
												}
											</Button>
										</InputGroup.Append>
										<Form.Control.Feedback type="invalid" className="login-pass-feedback">
											{errors.password}
										</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>
							</Form.Row>

							{/* Button */}
							<Form.Row className="d-flex justify-content-center">
								<Form.Group
									as={Col}
									sm={12}
									className="d-flex pt-3
									justify-content-between
									align-items-center"
								>
									<Link to="/register">
										Реєстрація
									</Link>
									<Link to="/recover">
										Відновлення паролю
									</Link>
								</Form.Group>
								<Form.Group
									as={Col}
									sm={12}
									className="d-flex pt-3
										justify-content-center
										align-items-center"
								>
									<BtnWithSpinner
										type="submit"
										loadingState={processingForm}
										disabled={reCaptchaScore !==null && reCaptchaScore < .3 ? true : false}
										label="Логін"
										variant="primary"
										dataCy="login-btn"
										className="primary-color-shadow px-5"
									/>
								</Form.Group>
							</Form.Row>
						</Form>
					)}
				</Formik>
			</Container>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		reCaptchaScore: state.notification.reCaptchaScore,
		processingForm: state.notification.processingForm
	}
}

const mapDispatchToProps = {
	login,
	setNotification,
	setRecaptchaScore,
	setProcessingForm,
	clearRecaptchaScore
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginForm)
