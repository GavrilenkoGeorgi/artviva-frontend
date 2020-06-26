import React, { useState, useRef, useEffect, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import emailService from '../../services/email'
import PropTypes from 'prop-types'

import { Container, Row, Col, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import * as Yup from 'yup'

import BtnWithSpinner from '../common/buttons/BtnWithSpinner'
import LoadingIndicator from '../common/LoadingIndicator'

const LazyReCaptchaComp = React.lazy(() => import('../common/ReCaptchaComp'))

const ContactForm = ({ setNotification }) => {

	const [processingForm, setProcessingForm] = useState(false)
	const componentIsMounted = useRef(true)

	useEffect(() => {
		return () => {
			componentIsMounted.current = false
		}
	}, [])

	const messageFormSchema = Yup.object().shape({
		name: Yup.string()
			.min(2, 'Мінімум 2 символи.')
			.max(30, 'Максимум 30 символів.')
			.required('Ваше ім\'я?'),
		email: Yup.string()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть свою електронну пошту.'),
		message: Yup.string()
			.max(280, 'Максимум 280 символів.')
			.required('Будь ласка, введіть своє повідомлення.')
	})

	const sendContactMessage = async values => {
		setProcessingForm(true)
		await emailService.sendContactEmail(values)
			.then(() => {
				setNotification({
					message: 'Ваше повідомлення надіслано, дякуємо вам.',
					variant: 'success'
				}, 5)
				setProcessingForm(false)
			})
			.catch(error => {
				setNotification({
					message: `На жаль, нам не вдалося надіслати ваше повідомлення, ось помилка: ${error.message}`,
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
						onSubmit={async (values, { resetForm }) => {
							await sendContactMessage(values)
							resetForm()
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
									<Form.Group controlId="name-input" as={Col}>
										<Form.Label>
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
									<Form.Group controlId="email-input" as={Col}>
										<Form.Label>
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
									<Form.Group controlId="message-input" as={Col}>
										<Form.Label>
											Ваше повідомлення
											<span className="required-text">*</span>
										</Form.Label>
										<Form.Control
											as="textarea"
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

								<Form.Row>
									<Col className="recaptcha-statement">
										Цей сайт захищений reCAPTCHA, і застосовуються
										<a href="https://policies.google.com/privacy">
											Політика конфіденційності
										</a>
										Google та
										<a href="https://policies.google.com/terms">
											Умови використання.
										</a>
									</Col>
								</Form.Row>

								{/* Button */}
								<Form.Row className="mt-3 d-flex justify-content-center">
									<BtnWithSpinner
										type="submit"
										loadingState={processingForm}
										disabled={score <= .1 ? true : false}
										waitingState={!score}
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
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				{/*
					window.grecaptcha ? <ReCaptcha/> : null
				*/}
				<LazyReCaptchaComp
					ref={reCaptchaRef}
					size="invisible"
					render="explicit"
					badge="none"
					hl="uk"
					setScore={setRecaptchaScore}
				/>
			</Suspense>
		</Container>
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

ContactForm.propTypes = {
	setNotification: PropTypes.func.isRequired
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactForm)
