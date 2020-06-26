import React from 'react'
import PaymentForm from '../forms/PaymentForm'
import { Container, Row, Col } from 'react-bootstrap'

const PaymentView = ({ match }) => {
	const { status } = { ...match.params }

	return (
		<Container>
			<Row className="d-flex justify-content-center text-center">
				<Col xs={12} sm={10} md={8} lg={7}>
					<h1 className="custom-font">
						Оплата навчання
					</h1>
					<h6 className="text-warning border border-warning rounded py-2">
						<em>тестовий режим</em>
					</h6>
					{status === 'success'
						? <h4 className="text-success pt-5">
							Дякуємо, ваш платіж отримано.
						</h4>
						: <PaymentForm />
					}
				</Col>
			</Row>
		</Container>
	)
}

export default PaymentView
