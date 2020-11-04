import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Container, Spinner, Col } from 'react-bootstrap'
import { setNotification } from '../../../reducers/notificationReducer'
import userService from '../../../services/users'

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
				const { message, variant } = { ...error.response.data }
				setActivationError(message)
				setNotification({
					message,
					variant: variant ? variant : 'danger'
				}, 5)
			})
			.finally(() => setProcessingActivation(false))
	// eslint-disable-next-line
	},[]) // ??

	return (
		<Container className="pt-4 mt-4 d-flex justify-content-center">
			<Col xs={8}>
				<h2 className="custom-font py-4 text-center">
					Активація облікового запису
				</h2>
				{ processingActivation
					? <Spinner animation="border" variant="primary" />
					: null }
				{ activated
					? <h5>
						Ваш обліковий запис активовано.
						Зачекайте, коли адміністратор перевірить і затвердить ваш обліковий запис користувача.
					</h5>
					: null }

				{ activationError
					? <h5 className="py-4 text-secondary">{activationError}</h5>
					: null }
			</Col>
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

