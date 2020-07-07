import React from 'react'
import moment from 'moment'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons'
import { Card } from 'react-bootstrap'

const PaymentCard = ({ payment }) => {
	// console.log('Payment card props:', payment)

	return (
		<Card className="my-3" bg="light">
			<Card.Header>
				{payment.status === 'success'
					? <FontAwesomeIcon className="text-success" icon={faCheck} />
					: <FontAwesomeIcon className="text-danger" icon={faExclamation} />
				} {payment.paymentDescr.teacher} &mdash; <strong>{payment.amount} грн</strong>
			</Card.Header>
			<Card.Body>
				<Card.Title className="mb-1">
					{payment.paymentDescr.pupil}
				</Card.Title>
				<Card.Text>
					<em className="text-muted text">{payment.paymentDescr.specialty}</em>
					<br />
					Дата: <strong>{moment(payment.create_date).format('LL')}</strong>
					<br />
					<small>
						<em className="text-muted">{payment.description}</em>
					</small>
				</Card.Text>
			</Card.Body>
		</Card>
	)
}

export default PaymentCard
