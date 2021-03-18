import React from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'

import PaymentForm from '../../forms/PaymentForm'
import CommonLayout from '../../CommonLayout'

const PaymentView = ({ match }) => {
	const { status } = { ...match.params }

	return <CommonLayout>
		<Container>
			<Row className="my-4 justify-content-center py-sm-5">
				<Col lg={8}>
					{status
						? <>
							{status === 'form'
								? <><h3 className="text-center custom-font pb-4">
									Оплата навчання
								</h3>
								<PaymentForm />
								</>
								: <>
									{status === 'success'
										? <><FontAwesomeIcon icon={faReceipt} className="fa-lg payment-status-icon"/>
											<h3 className="text-success pt-4">
												Дякуємо, ваш платіж обробляється.
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
	</CommonLayout>
}

export default PaymentView
