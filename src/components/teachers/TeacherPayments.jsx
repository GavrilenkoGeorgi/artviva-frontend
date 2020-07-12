import React, { useState } from 'react'
import moment from 'moment'
import { nestedSort } from '../../utils/arrayHelpers'

import { Container, Form } from 'react-bootstrap'
import PaymentDescr from '../payments/PaymentDescr'
import Emoji from '../common/Emoji'

const TeacherPayments = ({ payments }) => {

	const [paymentsData, setPaymentsData] = useState(payments)
	const [descPayPupilNameSortOrder, setDescPayPupilNameSortOrder] = useState(false)
	const [descPayDateSortOrder, setDescPayDateSortOrder] = useState(true)

	// date now
	const today = moment(new Date())
	// start and end date of the current school year
	const startOfSchoolYear = moment([today.get('year') - 1, 8, 1])
	const endOfSchoolYear = moment([today.get('year'), 5, 1])
	const dates = {
		today,
		startOfSchoolYear,
		endOfSchoolYear
	}

	const sortByField = ({ checked, id }) => {
		const order = checked ? 'desc' : 'asc'
		switch (id) {
		case 'pupil':
			setDescPayPupilNameSortOrder(checked)
			setPaymentsData(payments.sort(nestedSort('paymentDescr', id, order)))
			break
		case 'create_date':
			setDescPayDateSortOrder(checked)
			setPaymentsData(payments.sort(nestedSort(id, null, order)))
			break
		default:
			console.warn('Check sort criteria.')
		}
	}

	return (
		<>
			<h4 className="py-3 text-center custom-font">
				<Emoji label="Dollar Banknote" emoji={'💵'} /> Платежі:
			</h4>
			{/* Sorting controls */}
			<Form>
				<Form.Check
					custom
					inline
					type="checkbox"
					id="pupil"
					label="Ім'я учня Я-А"
					checked={descPayPupilNameSortOrder}
					onChange={event => sortByField(event.target)}
				/>
				<Form.Check
					custom
					inline
					type="checkbox"
					id="create_date"
					label={`Дата оплати ${descPayDateSortOrder ? ' - нові вгорі' : ''}`}
					checked={descPayDateSortOrder}
					onChange={event => sortByField(event.target)}
				/>
			</Form>
			{(paymentsData.length === 0)
				?	<p className="py-3 text-muted">Ви ще не маєте жодних платежів.</p>
				: null
			}
			{paymentsData.map(payment => (
				<Container
					key={payment.id}
					className="payment-description-container border rounded my-2"
				>
					<PaymentDescr
						data={payment}
						dates={dates}
					/>
				</Container>
			))}
		</>
	)
}

export default TeacherPayments
