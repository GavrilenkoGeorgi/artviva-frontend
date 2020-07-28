import React, { useState } from 'react'
import { connect } from 'react-redux'
import RecoverForm from '../forms/RecoverForm'
import { Container, Col } from 'react-bootstrap'

const RecoverView = () => {

	const [emailSent, setEmailSent] = useState(false)

	return (
		<Container>
			<Col xs={12}>
				{emailSent
					? <h4 className="text-success text-center">
						На вашу електронну адресу надіслано лист з інструкціями щодо відновлення пароля.
					</h4>
					: <>
						<h3 className="text-center custom-font py-5">
							Надіслати скидання пароля
						</h3>
						<p className="pb-5 text-muted text-center">
							<em>
								Введіть електронну адресу, яку ви використовували для реєстрації.
							</em>
						</p>
						<RecoverForm setEmailSent={setEmailSent} />
					</>
				}
			</Col>
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
