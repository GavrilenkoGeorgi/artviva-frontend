import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'
import PaymentForm from '../forms/PaymentForm'
import { Container, Row, Col } from 'react-bootstrap'

const PaymentView = ({ match }) => {
	const { status } = { ...match.params }

	return (
		<Container className="text-center">
			<Row className="pt-4 d-flex justify-content-center">
				<Col lg={7} className="pt-4">
					{status
						? <>
							{status === 'form'
								? <><h3 className="custom-font pb-4">
									Оплата навчання
								</h3>
								<PaymentForm />
								</>
								: <>
									{status === 'success'
										? <><FontAwesomeIcon icon={faReceipt} className="fa-lg payment-status-icon"/>
											<h3 className="text-success pt-4">
												Дякуємо, ваш платіж отримано
											</h3></>
										: <><h3 className="pt-4">
											Статус вашого платіжу {status}
										</h3>
										</>
									}
								</>
							}
						</>
						: null
					}
				</Col>
			</Row>
		</Container>
	)
}

export default PaymentView
