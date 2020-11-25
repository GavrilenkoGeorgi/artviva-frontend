import React from 'react'

import CommonLayout from '../../CommonLayout'
import PassResetForm from '../../forms/PassResetForm'
import { Container, Row, Col } from 'react-bootstrap'

const PassResetView = ({ match }) => {
	return <CommonLayout>
		<h2 className="mt-4 mt-lg-5 text-center custom-font">
			Введіть новий пароль
		</h2>
		<Container>
			<Row className="mb-5 justify-content-center">
				<Col lg={7}>
					<PassResetForm
						passResetToken={match.params.uuid}
						email={match.params.email}
					/>
				</Col>
			</Row>
		</Container>
	</CommonLayout>
}

export default PassResetView