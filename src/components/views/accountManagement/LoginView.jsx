import React, { useRef, useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { Helmet } from 'react-helmet'
import { history } from '../../../Routes'
import PropTypes from 'prop-types'

import recaptchaService from '../../../services/recaptcha'
import { login } from '../../../reducers/loginReducer'
import { setNotification, setProcessingForm } from '../../../reducers/notificationReducer'

import { Container, Row, Col, Image } from 'react-bootstrap'
import LoginForm from '../../forms/LoginForm'
import CommonLayout from '../../CommonLayout'
import styles from './LoginView.module.sass'

const LoginView = ({
	login,
	processingForm,
	setNotification,
	setProcessingForm
}) => {

	const { executeRecaptcha } = useGoogleReCaptcha()
	const unmounted = useRef(false)
	const [score, setScore] = useState(0)
	const [loginData, setLoginData] = useState({})
	const [loginSuccessful, setLoginSuccessful] = useState(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const handleLogin = (values) => {
		setProcessingForm(true)
		setLoginData(values)
		getReCaptchaScore()
	}

	const getReCaptchaScore = () => {
		window.Cypress
			? setScore(.3)
			: executeRecaptcha('login')
				.then(token => {
					return recaptchaService.verify(token)
				})
				.then(result => {
					setScore(result.score)
				})
				.finally(() => {
					if (!unmounted.current)
						setProcessingForm(false)
				})
	}

	const loginUser = useCallback(loginData => {
		login(loginData)
			.then(() => {
				setNotification({
					message: 'Вхід вдалий.',
					variant: 'info'
				}, 5)
				setLoginSuccessful(true)
			})
			.catch((error) => {
				console.error(error)
			})
			.finally(() => {
				if (!unmounted.current)
					setProcessingForm(false)
			})
	}, [login, setNotification, setProcessingForm])

	useEffect(() => {
		if (loginData && score >= .3) {
			loginUser(loginData)
		}
	}, [score, loginData, loginUser])

	useEffect(() => {
		if (loginSuccessful) {
			history.push('/school')
		}
	}, [loginSuccessful])

	return <>
		<Helmet>
			<title>Логін сторінка для вчителів</title>
			<meta name="description" content="Логін сторінка для вчителів школи мистецтв «АРТ ВІВА»" />
		</Helmet>
		<CommonLayout>
			<Container>
				<Row className="justify-content-center">
					<Col xs={6} md={4} className="d-flex">
						<Image
							src="img/logo/artviva_logo.webp"
							alt="ArtViva logo"
							className={styles.logo}
						/>
					</Col>
					<Col xs={12} md={5}>
						<h1 className="text-center custom-font my-4">
							Логін
						</h1>
						<LoginForm
							handleLogin={handleLogin}
							processing={processingForm}
							score={score}
						/>
					</Col>
				</Row>
			</Container>
		</CommonLayout>
	</>
}

LoginView.propTypes = {
	login: PropTypes.func.isRequired,
	processingForm: PropTypes.bool.isRequired,
	setNotification: PropTypes.func.isRequired,
	setProcessingForm: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
	return {
		processingForm: state.notification.processingForm
	}
}

const mapDispatchToProps = {
	login,
	setNotification,
	setProcessingForm,
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(LoginView)
