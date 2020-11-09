import React, { useRef, useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import emailService from '../../services/email'
import PropTypes from 'prop-types'
import { setNotification,	setRecaptchaScore,
	setProcessingForm } from '../../reducers/notificationReducer'

import { Container, Row, Col, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { BtnWithSpinner } from '../common/buttons'

const ContactForm = ({
	reCaptchaScore,
	processingForm,
	setNotification,
	setRecaptchaScore,
	setProcessingForm }) => {

	const [messageData, setMessageData] = useState(null)
	const unmounted = useRef(false)
	const { executeRecaptcha } = useGoogleReCaptcha()

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const sendContactMessage = useCallback(async messageData => {
		await emailService.sendContactEmail(messageData.values)
			.then(() => {
				setNotification({
					message: 'Ваше повідомлення надіслано, дякуємо вам.',
					variant: 'success'
				}, 5)
				setProcessingForm(false)
				messageData.resetForm()
			})
			.catch(error => {
				setNotification({
					message: `На жаль, нам не вдалося надіслати ваше повідомлення, ось помилка: ${error.message}`,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (!unmounted.current) setProcessingForm(false)
			})
	}, [setNotification, setProcessingForm])

	const getRecaptchaScore = () => {
		window.Cypress
			? setRecaptchaScore()
			: executeRecaptcha('homepage')
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

	useEffect(() => {
		if (messageData && reCaptchaScore > .1) {
			sendContactMessage(messageData)
		}
	}, [reCaptchaScore, messageData, sendContactMessage])

	const messageFormSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'Мінімум 2 символи.')
			.max(30, 'Максимум 30 символів.')
			.required('Ваше ім\'я?'),
		email: Yup.string().trim()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть свою електронну пошту.'),
		message: Yup.string()
			.min(8, 'Мінімум 8 символів.')
			.max(280, 'Максимум 280 символів.')
			.required('Будь ласка, введіть своє повідомлення.')
	})

	return (
		<Container className="py-4">
			<Row className="d-flex justify-content-center">
				<Col sm={10} md={7} lg={6}>
					<h1 className="text-center custom-font pb-4">Зворотній зв&apos;язок</h1>
					<Formik
						initialValues={{
							name: '',
							email: '',
							message: ''
						}}
						onSubmit={(values, { resetForm }) => {
							setProcessingForm(true)
							setMessageData({ values, resetForm })
							getRecaptchaScore()
						}}
						validationSchema={messageFormSchema}
					>
						{({ handleSubmit,
							handleChange,
							handleBlur,
							values,
							touched,
							errors
						}) => (
							<Form
								data-cy="contact-form"
								noValidate
								onSubmit={handleSubmit}
							>

								{/* Message sender name input */}
								<Form.Row>
									<Form.Group controlId="name" as={Col}>
										<Form.Label
											aria-labelledby="name"
										>
											Ваше ім&apos;я
											<span className="required-text">*</span>
										</Form.Label>
										<Form.Control
											type="text"
											name="name"
											data-cy="name-input"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.name}
											isValid={touched.name && !errors.name}
											isInvalid={touched.name && !!errors.name}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.name}
										</Form.Control.Feedback>
									</Form.Group>
								</Form.Row>

								{/* Message sender email input */}
								<Form.Row>
									<Form.Group controlId="email" as={Col}>
										<Form.Label
											aria-labelledby="email"
										>
											Ваша електронна пошта
											<span className="required-text">*</span>
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

								{/* Message body input */}
								<Form.Row>
									<Form.Group controlId="message" as={Col}>
										<Form.Label
											aria-labelledby="message"
										>
											Ваше повідомлення
											<span className="required-text">*</span>
										</Form.Label>
										<Form.Control
											as="textarea"
											type="textarea"
											name="message"
											rows="6"
											data-cy="message-input"
											onChange={handleChange}
											onBlur={handleBlur}
											value={values.message}
											isValid={touched.message && !errors.message}
											isInvalid={touched.message && !!errors.message}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.message}
										</Form.Control.Feedback>
									</Form.Group>
								</Form.Row>

								{/* Button */}
								<Form.Row className="mt-3 d-flex justify-content-center">
									<BtnWithSpinner
										type="submit"
										loadingState={processingForm}
										disabled={reCaptchaScore !==null && reCaptchaScore <= .1 ? true : false}
										label="Відправити"
										variant="primary"
										dataCy="contact-msg-btn"
										className="primary-color-shadow max-width-btn"
									/>
								</Form.Row>
							</Form>
						)}
					</Formik>
				</Col>
			</Row>
		</Container>
	)
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
	setProcessingForm
}

ContactForm.propTypes = {
	reCaptchaScore: PropTypes.number,
	processingForm: PropTypes.bool.isRequired,
	setNotification: PropTypes.func.isRequired,
	setRecaptchaScore: PropTypes.func.isRequired,
	setProcessingForm: PropTypes.func.isRequired
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactForm)
