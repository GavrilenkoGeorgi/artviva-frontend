import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import passwordService from '../../services/password'

import { Col, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'

import ReCaptchaComp from '../common/ReCaptchaComp'
import BtnWithSpinner from '../common/buttons/BtnWithSpinner'

const RecoverForm = ({ setNotification, setEmailSent }) => {

	const [processingForm, setProcessingForm] = useState(false)
	const componentIsMounted = useRef(true)

	useEffect(() => {
		return () => {
			componentIsMounted.current = false
		}
	}, [])

	const handleRecover = async values => {
		setProcessingForm(true)
		await passwordService.sendRecoveryEmail(values)
			.then(() => {
				setNotification({
					message: 'Інструкції щодо відновлення пароля були надіслані на вашу електронну адресу.',
					variant: 'success'
				}, 5)
				setEmailSent(true)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (componentIsMounted.current)setProcessingForm(false)
			})
	}

	const reCaptchaRef = React.createRef()
	const [score, setScore] = useState(null)

	const setRecaptchaScore = score => {
		if (componentIsMounted.current) {
			if (score <= .1) {
				setNotification({
					message: `Ваша оцінка recaptcha занизька: ${score}, спробуйте оновити сторінку.`,
					variant: 'warning'
				}, 5)
			}
			setScore(score)
		}
	}

	const recoverFormSchema = Yup.object().shape({
		email: Yup.string()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть свою електронну пошту.')
	})

	return (
		<>
			<Formik
				initialValues={{
					email: ''
				}}
				onSubmit={async (values, { resetForm }) => {
					await handleRecover(values)
					resetForm()
				}}
				validationSchema={recoverFormSchema}
			>
				{({ handleSubmit,
					handleChange,
					handleBlur,
					values,
					touched,
					errors
				}) => (
					<Form
						data-cy="recover-form"
						noValidate
						onSubmit={handleSubmit}
					>

						{/* User email input */}
						<Form.Row className="d-flex justify-content-center">
							<Form.Group as={Col} sm="8" md="6">
								<Form.Label>
									Електронна пошта:
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

						{/* Button */}
						<Form.Row className="d-flex justify-content-center">
							<BtnWithSpinner
								type="submit"
								variant="primary"
								dataCy="recover-pass-btn"
								className="primary-color-shadow default-width-btn"
								label="Надіслати"
								loadingState={processingForm}
								disabled={score <= .1 ? true : false}
								waitingState={!score}
							/>
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
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RecoverForm)
