import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Container, Spinner } from 'react-bootstrap'
import { setNotification } from '../../reducers/notificationReducer'
import userService from '../../services/users'

const ActivateAccountView = ({ match, setNotification }) => {

	const [activated, setActivated] = useState(false)
	const [activationError, setActivationError] = useState(null)
	const [processingActivation, setProcessingActivation] = useState(true)

	// activation data to send
	const data = {
		email: match.params.email,
		activationToken: match.params.uuid
	}

	useEffect(() => {
		userService.activate(data)
			.then(() => {
				setNotification({
					message: 'Ваш обліковий запис активовано.',
					variant: 'success'
				}, 5)
				setActivated(true)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setActivationError(message)
				setNotification({
					message: `Нам не вдалося активувати ваш акаунт: ${message}`,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingActivation(false))
	// eslint-disable-next-line
	},[])

	return (
		<Container className="pt-4 mt-4 text-center">
			<h1 className="custom-font py-4">
				Активація облікового запису...
			</h1>
			{ processingActivation ? <Spinner animation="border" variant="primary" /> : null }
			{ activated
				? <h5>
					Ваш обліковий запис активовано.
					Зачекайте, коли адміністратор перевірить і затвердить ваш обліковий запис користувача.
				</h5>
				: null
			}
			{ activationError ? <h5>{activationError}</h5> : null }
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		account: state.account
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ActivateAccountView)

