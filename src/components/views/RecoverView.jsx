import React, { useState } from 'react'
import { connect } from 'react-redux'
import RecoverForm from '../forms/RecoverForm'
import { Container, Row, Col } from 'react-bootstrap'

const RecoverView = () => {

	const [emailSent, setEmailSent] = useState(false)

	return (
		<Container>
			<Row>
				<Col xs={12}>
					{emailSent
						? <h4 className="text-success text-center">
							На вашу електронну адресу надіслано лист з інструкціями щодо відновлення пароля.
						</h4>
						: <>
							<h3 className="text-center custom-font py-2">
								Надіслати скидання пароля
							</h3>
							<em className="text-muted">
								Введіть електронну адресу, яку ви використовували для реєстрації.
							</em>
							<RecoverForm setEmailSent={setEmailSent} />
						</>
					}
				</Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(RecoverView)
