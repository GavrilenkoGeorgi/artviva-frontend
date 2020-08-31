import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import passwordService from '../../services/password'
import { setNotification, setRecaptchaScore,
	clearRecaptchaScore,	setProcessingForm } from '../../reducers/notificationReducer'
import { Col, Form, InputGroup, Button } from 'react-bootstrap'

import { Formik } from 'formik'
import * as Yup from 'yup'

import { BtnWithSpinner } from '../common/buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const PassResetForm = ({
	reCaptchaScore,
	processingForm,
	setProcessingForm,
	setRecaptchaScore,
	clearRecaptchaScore,
	setNotification,
	passResetToken,
	email }) => {

	const [resetValues, setResetValues] = useState(null)
	const [resetSuccessful, setResetSuccessful] = useState(false)
	const history = useHistory()
	const unmounted = useRef(false)
	const { executeRecaptcha } = useGoogleReCaptcha()

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	useEffect(() => {
		if (resetSuccessful) {
			history.push('/login')
		}
	}, [resetSuccessful, history, setProcessingForm])

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
				}, 10)
				clearRecaptchaScore()
			})
			.finally(() => {
				setProcessingForm(false)
			})
	}

	const resetPassword = useCallback(values => {

		const data = { // this!
			email,
			passResetToken: passResetToken,
			password: values.password
		}

		passwordService.resetUserPassword(data)
			.then(() => {
				setNotification({
					message: 'Пароль успішно скинутий, ви можете ввійти зараз з новим паролем.',
					variant: 'success'
				}, 10)
				setResetSuccessful(true)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 10)
			})
	}, [email, passResetToken, setNotification])

	useEffect(() => {
		if (resetValues && reCaptchaScore >= .3) {
			resetPassword(resetValues)
		}
	}, [reCaptchaScore, resetValues, resetPassword])

	// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
	const mediumStrPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

	const loginFormSchema = Yup.object().shape({
		password: Yup.string()
			.min(8, 'Мінімум 8 символів.')
			.matches(mediumStrPass,
				'Мінімум 8 латинських символів, принаймні одна велика літера, одна маленька літера та одне число.')
			.required('Будь ласка, введіть свій новий пароль.'),
		passwordConfirm: Yup.string()
			.min(8, 'Мінімум 8 символів.')
			.matches(mediumStrPass,
				'Мінімум 8 латинських символів, принаймні одна велика літера, одна маленька літера та одне число.')
			.required('Будь ласка, введіть підтвердження свого нового пароля.')
			.when('password', {
				is: value => value && value.length > 0,
				then: Yup.string()
					.oneOf([Yup.ref('password')], 'Обидва паролі повинні бути однаковими.')
			})
	})

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

	return <Formik
		initialValues={{
			password: '',
			passwordConfirm: ''
		}}
		onSubmit={async (values) => {
			setProcessingForm(true)
			setResetValues(values)
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
				data-cy="pass-reset-form"
				noValidate
				onSubmit={handleSubmit}
			>
				{/* User new password input */}
				<Form.Group as={Col} xs={12}>
					<Form.Label>
						Ваш новий пароль
					</Form.Label>
					<InputGroup>
						<Form.Control
							id="new-user-pass"
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
						<Form.Control.Feedback>
							Ok
						</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							{errors.password}
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>

				{/* User new password confirmation input */}
				<Form.Group as={Col} xs={12}>
					<Form.Label>
						Ваш новий пароль ще раз (підтвердження)
					</Form.Label>
					<InputGroup>
						<Form.Control
							id="confirm-user-pass"
							className="elevated-z-index"
							type={passConfirmHidden ? 'text' : 'password'}
							name="passwordConfirm"
							data-cy="confirm-password-input"
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
						<Form.Control.Feedback>
							Ok
						</Form.Control.Feedback>
						<Form.Control.Feedback type="invalid">
							{errors.passwordConfirm}
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>

				{/* Button */}
				<Form.Group className="d-flex justify-content-center" >
					<BtnWithSpinner
						type="submit"
						loadingState={processingForm}
						disabled={reCaptchaScore !==null && reCaptchaScore < .3 ? true : false}
						label="Змінити пароль"
						variant="primary"
						dataCy="pass-reset-btn"
						className="primary-color-shadow px-5 mt-4"
					/>
				</Form.Group>
			</Form>
		)}
	</Formik>
}

const mapStateToProps = (state) => {
	return {
		reCaptchaScore: state.notification.reCaptchaScore,
		processingForm: state.notification.processingForm
	}
}

const mapDispatchToProps = {
	setNotification,
	setRecaptchaScore,
	setProcessingForm,
	clearRecaptchaScore
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PassResetForm)
