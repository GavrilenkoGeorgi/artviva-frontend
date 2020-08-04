import React from 'react'

import { Row, Col } from 'react-bootstrap'

const TeacherPaymentsList = ({ payments }) => {

	const schoolYear =
		['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень']

	return <>
		{payments.map(payment => (
			<Row key={payment.id} className="my-4 border1 rounded">
				<Col xs={12} className="py-2">
					<h5 className="custom-font payment-pupil-name">{payment.paymentDescr.pupil} {payment.amount} грн</h5>
				</Col>
				<Col xs={12} className="pb-2">
					<em className="text-muted">
						{payment.paymentDescr.specialty}
					</em>
				</Col>
				{schoolYear.map(month =>
					<Col key={month}
						xs={4}
						sm={3}
						className="m-0 p-0 border1">
						<p className={`paid-month ${payment.paymentDescr.months.includes(month) ? 'highlighted' : ''}`}>{month}</p>
					</Col>
				)}
			</Row>
		))}
	</>
}

export default TeacherPaymentsList
