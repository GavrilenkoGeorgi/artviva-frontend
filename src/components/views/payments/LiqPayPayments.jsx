import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import paymentService from '../../../services/payment'
import { setNotification, setFetchingData } from '../../../reducers/notificationReducer'
import moment from 'moment'
import 'moment-precise-range-plugin'
import { useScrollPosition } from '../../../hooks/scrollHooks'
import { toHumanReadable } from '../../../utils/datesAndTime'
import getPaymentDataFromString from '../../../utils/parsePaymentDescr'

import CommonLayout from '../CommonLayout'
import DateRangeInput from './DateRangeInput'
import { Container, Row, Col } from 'react-bootstrap'

const LiqPayPayments = ({
	user, setNotification, setFetchingData }) => {

	const today = moment()
	// last month shown by default
	const defaultLiqPayDateRange = (date) => {
		const fromDate = moment(date)
		return {
			date_from: fromDate.set('month', (date.get('month') - 1 )).valueOf(),
			date_to: date.valueOf() }
	}

	const [range, setRange] = useState(defaultLiqPayDateRange(today))
	const [paymentsList, setPaymentsList] = useState([])
	const schoolYear =
		['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень']

	const humanReadableRange = ({ date_from, date_to }) => {
		const { years, months, days } = moment.preciseDiff(date_from, date_to, true)

		return <>
			{years
				? <span>{years} р.</span>
				: null
			}
			{months
				? <span> {months} міс.</span>
				: null
			}
			{days
				? <span> {days} дн.</span>
				: null
			}
		</>
	}

	useEffect(() => {
		if (user) {
			paymentService.setToken(user.token)
		}
	}, [user])

	useEffect(() => {
		setFetchingData(true)
		paymentService.getLiqPayResults(range)
			.then(result => {
				setPaymentsList(result.data.reverse())
			})
			.catch(error => {
				setNotification({
					message: error.message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setFetchingData(false))
	}, [range, setNotification, setFetchingData])

	// progressively add more data on scroll
	const [maxCount, setMaxCount] = useState(15)
	useScrollPosition(position => {
		if ((position + window.innerHeight) >= document.body.scrollHeight) {
			setMaxCount(count => count + 3)
		}
	})

	const ParsedDescription = ({ descr }) => {
		if (descr) {
			const parsedDescr = getPaymentDataFromString(descr, 'uk-UA')
			return <Row>
				<Col md={6}>
					<h6 className="custom-font payment-pupil-name">{parsedDescr.pupil} - {parsedDescr.specialty}</h6>
				</Col>
				<Col md={6} className="mb-2">
					<em className="text-muted">{parsedDescr.teacher}</em>
				</Col>
				{/* Months */}
				{schoolYear.map(month =>
					<Col key={month}
						xs={4}
						sm={3}
						className="m-0 p-0">

						<p className={`paid-month ${parsedDescr.months.includes(month) ? 'highlighted' : ''}`}>
							{month}
						</p>
					</Col>
				)}
			</Row>
		}
		return <>Cant parse payment descr!</>
	}

	return <CommonLayout>
		<Container>
			<Row>
				<Col xs={12}>
					<h1 className="text-center custom-font">Платежі</h1>
					<h6 className="text-muted text-center">(дані з бази даніх liqpay)</h6>
				</Col>
				<Col>
					<DateRangeInput
						range={range}
						setRange={setRange} />
				</Col>
				{paymentsList.length
					? <Container className="mx-2">
						<Col className="my-4 text-right">
							<em>Загалом <span>за {humanReadableRange(range)}</span>:{' '}
								<strong>{paymentsList.length}</strong> шт.</em>
						</Col>
						{paymentsList.slice(0, maxCount).map(payment => (
							<Row key={payment.order_id} className="my-3 py-2 p-sm-3 border rounded">
								<Col xs={6}>
									{toHumanReadable('uk-ua', payment.create_date)}
								</Col>
								<Col xs={6}>
									{payment.status === 'success'
										? <span className="text-success">{payment.status}</span>
										: <span className="text-warning">
											{payment.status}: {payment.err_description}
										</span>
									}
								</Col>
								<Col sm={9} className="mt-3 text-muted">
									<small><em>{payment.description}</em></small>
								</Col>
								<Col sm={3} className="d-flex align-items-center justify-content-center">
									<strong>{payment.amount}<em>&nbsp;грн</em></strong>
								</Col>
								<Col xs={12} className="mt-4">
									<ParsedDescription descr={payment.description} />
								</Col>
							</Row>
						))}
					</Container>
					: <Container>
						<Col className="my-3 text-center">
							<p>
								Не вдається знайти платежі за певний діапазон, спробуйте відкоригувати його.
							</p>
						</Col>
					</Container>
				}
			</Row>
		</Container>
	</CommonLayout>
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification,
	setFetchingData
}

export default connect (
	mapStateToProps,
	mapDispatchToProps
)(LiqPayPayments)
