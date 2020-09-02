import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import RegisterForm from '../forms/RegisterForm'

const RegisterView = () => {

	const [registrationSuccessful, setRegistrationSuccessful] = useState(false)

	return (
		<Container>
			<Row className="d-flex justify-content-center align-items-center">
				<Col xs={12} sm={10} md={7} className="text-center">
					{ registrationSuccessful
						? <h5 className="mt-4">
							Щоб активувати обліковий запис користувача,
							дотримуйтесь інструкцій у електронному
							повідомленні, надісланому на вашу електронну адресу.
						</h5>
						: <>
							<h1 className="text-center custom-font my-4">
								Реєстрація
							</h1>
							<h4 className="text-center text-muted custom-font">
								(для вчителів)
							</h4>
							<RegisterForm
								setRegistrationSuccessful={setRegistrationSuccessful}
								registrationSuccessful={registrationSuccessful}
							/>
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
)(RegisterView)
