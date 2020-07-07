import React from 'react'
import moment from 'moment'

import { Row, Col } from 'react-bootstrap'

const PaymentDescr = ({ data, dates } ) => {

	const paymentDate = moment(data.create_date)
	let schoolYear = ''

	if (paymentDate.isBetween(dates.startOfSchoolYear, dates.endOfSchoolYear)) {
		schoolYear = `${dates.startOfSchoolYear.get('year')} - ${dates.endOfSchoolYear.get('year')}`
	} else if (paymentDate.isAfter(dates.endOfSchoolYear)) {
		schoolYear = `${dates.endOfSchoolYear.get('year')} - ${dates.endOfSchoolYear.get('year') + 1}`
	} else {
		schoolYear = paymentDate.get('year')
	}

	return (
		<>
			<Row className="payment-header border1 border-success p-2">
				<Col xs={12} md={6}>
					{data.paymentDescr.pupil} <strong>{schoolYear}</strong> рік
				</Col>
				<Col className="d-flex justify-content-end">
					<em className="text-muted payment-date"> {paymentDate.format('LL')}</em>
				</Col>
			</Row>
			<Row className="payment-months">
				{data.paymentDescr.months.map(month => (
					<Col xs={3}
						key={month}
						className="payment-month py-1 border1 border-danger"
					>
						<strong>{month}</strong>
					</Col>
				))}
			</Row>
		</>
	)
}

const MemodPaymentDescr = React.memo(PaymentDescr)
export default MemodPaymentDescr
