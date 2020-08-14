import React from 'react'
import { toHumanReadable } from '../../utils/datesAndTime'

import { Container, Row, Col } from 'react-bootstrap'

const Payment = ({ payment }) => {

	return (
		<Container className="border">
			<Row className="d-flex align-items-center">
				<Col xs={4}>
					<small>
						{toHumanReadable('uk-ua', payment.create_date)}
					</small>
				</Col>
				<Col xs={4}>
					<em className="text-success">{payment.status === 'success' ? 'Успіх' : 'Check details'}</em>
				</Col>
				<Col xs={4}>
					<strong>{payment.amount} грн</strong>
				</Col>
				<Col xs={12} className="pt-3">
					<p>
						<span className="text-muted">Викладач:</span> {payment.paymentDescr.teacher}
					</p>
					<p>
						<span className="text-muted">Учень:</span> {payment.paymentDescr.pupil}
					</p>
					<p>
						<span className="text-muted">Предмет:</span> {payment.paymentDescr.specialty}
					</p>
					<span className="text-muted">Місяці</span>
					<ol>
						{payment.paymentDescr.months.map(month =>
							<li key={month}>{month}</li>
						)}
					</ol>
				</Col>
			</Row>
		</Container>
	)
}

export default Payment
