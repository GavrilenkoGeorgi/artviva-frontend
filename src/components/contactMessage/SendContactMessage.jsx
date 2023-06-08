import React, { useEffect, useRef, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import emailService from '../../services/email'
import { setNotification,	setRecaptchaScore,
	setProcessingForm } from '../../reducers/notificationReducer'

import { Container, Row, Col } from 'react-bootstrap'
import ContactForm from '../forms/ContactForm'

const SendContactMessage = ({
	setNotification,
	setProcessingForm,
	setRecaptchaScore,
	reCaptchaScore,
	processingForm }) => {

	const [messageData, setMessageData] = useState({})
	const unmounted = useRef(null)
	const { executeRecaptcha } = useGoogleReCaptcha()

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	// prepare data
	const handleContactMessage = data => {
		setProcessingForm(true)
		setMessageData(data)
		getRecaptchaScore()
	}

	// reCaptcha score
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

	// send email message
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

	useEffect(() => {
		if (messageData && reCaptchaScore > .3) {
			sendContactMessage(messageData)
		}
	}, [reCaptchaScore, messageData, sendContactMessage])

	return <Container className="py-4 my-4 py-sm-5 my-sm-5 fluid1">
		<Row className="justify-content-center">
			<h2 className="text-center custom-font">
				Зворотній зв&apos;язок
			</h2>
		</Row>
		<Row className="justify-content-center">
			<Col md={6}>
				<ContactForm
					handleContactMessage={handleContactMessage}
					score={reCaptchaScore}
					processing={processingForm}
				/>
			</Col>
		</Row>
	</Container>
}

SendContactMessage.propTypes = {
	setNotification: PropTypes.func.isRequired,
	setProcessingForm: PropTypes.func.isRequired,
	setRecaptchaScore: PropTypes.func.isRequired,
	reCaptchaScore: PropTypes.number,
	processingForm: PropTypes.bool.isRequired
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SendContactMessage)
