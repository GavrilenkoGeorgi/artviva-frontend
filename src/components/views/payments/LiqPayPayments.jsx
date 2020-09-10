import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import paymentService from '../../../services/payment'
import { setNotification, setFetchingData } from '../../../reducers/notificationReducer'
import { getLiqPayData } from '../../../reducers/liqPayDataReducer'
import moment from 'moment'
import 'moment-precise-range-plugin'
import { useScrollPosition } from '../../../hooks/scrollHooks'
import { toHumanReadable } from '../../../utils/datesAndTime'
import getPaymentDataFromString from '../../../utils/parsePaymentDescr'
import { substractLiqPayPercent } from '../../../utils/paymentsHelper'

import { Container, Row, Col } from 'react-bootstrap'
import CommonLayout from '../CommonLayout'
import DateRangeInput from './DateRangeInput'
import { Button } from '../../../components/common/buttons'
import { FilterData } from '../../sorting'

const LiqPayPayments = ({
	user, liqPayData, setNotification, setFetchingData, getLiqPayData }) => {

	const today = moment()
	// last month shown by default
	const defaultLiqPayDateRange = (date) => {
		const fromDate = moment(date)
		return {
			date_from: fromDate.set('month', (date.get('month') - 1 )).valueOf(),
			date_to: date.valueOf() }
	}

	const [filter, setFilter] = useState('')
	const [hideSuccessful, setHideSuccessful] = useState(false)
	const [range, setRange] = useState(defaultLiqPayDateRange(today))
	const [paymentsList, setPaymentsList] = useState([])
	const [totals, setTotals] = useState({ success: 0, failure: 0 })
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
		if (filter) {
			const result = liqPayData.filter(item => item.description.toUpperCase().includes(filter.toUpperCase()))
			setPaymentsList([ ...result ])
		} else {
			setPaymentsList(liqPayData)
		}
	},[filter, liqPayData])

	useEffect(() => {
		if (hideSuccessful) {
			const result = liqPayData.filter(item => item.status !== 'success')
			setPaymentsList([ ...result ])
		} else {
			setPaymentsList(liqPayData)
		}
	}, [hideSuccessful, liqPayData])

	useEffect(() => {
		const adjustedForPercent =
			liqPayData.map(item => ({ ...item, amount: substractLiqPayPercent(item.amount) }) )
		setPaymentsList(adjustedForPercent)
		setTotals(calcTotals(adjustedForPercent))
	}, [liqPayData])

	useEffect(() => {
		if (user) {
			paymentService.setToken(user.token)
		}
	}, [user])

	useEffect(() => {
		if (user) {
			setFetchingData(true)
			getLiqPayData(range)
				.then(() => {
					console.log('Reducer payments set')
				})
				.catch(error => {
					setNotification({
						message: error.message,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}, [range, user, setNotification, setFetchingData, getLiqPayData])

	// progressively add more data on scroll
	const [maxCount, setMaxCount] = useState(15)
	useScrollPosition(position => {
		if ((position + window.innerHeight) >= document.body.scrollHeight) {
			setMaxCount(count => count + 3)
		}
	})

	const calcTotals = data => {
		const total = data.reduce((a, b) => a + (b.amount || 0), 0)
		const successfulPayments = data.filter(item => item.status === 'success')
		const success = successfulPayments.reduce((acc, item) => acc + (item.amount || 0), 0)
		return {
			success,
			failure: total - success
		}
	}

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
				<Col xs={12}>
					<DateRangeInput
						range={range}
						setRange={setRange} />
				</Col>

				<Col xs={12} className="d-flex align-items-center justify-content-center">
					<FilterData
						filter={e => setFilter(e.target.value)}
						fieldName="query"
						placeholder="Пошук по опису платежа (викладач, учень, предмет)"
					/>
				</Col>
				<Col xs={12} className="mt-4 d-flex align-items-center justify-content-center">
					<Button
						label={hideSuccessful ? 'Показати всі' : 'Сховати успішни'}
						dataCy="filter-by-status-btn"
						onClick={() => setHideSuccessful(!hideSuccessful)}
						type="button"
						variant={hideSuccessful ? 'outline-primary' : 'primary'}
					/>
				</Col>

				{paymentsList.length
					? <Container className="mx-2">
						<Row className="my-4 py-3 text-right border rounded">
							<Col sm={6} className="mb-2111">
								<em>Платежів <span>за {humanReadableRange(range)}</span>:{' '}
									<strong>{paymentsList.length}</strong> шт.</em>
							</Col>
							<Col sm={6}>
								{hideSuccessful
									? <span className='text-warning'>
										<em>Невдали платежі <span> за {humanReadableRange(range)}
										</span>:{' '}
										<strong>{totals.failure.toFixed(2)}</strong> грн.</em></span>
									: <em>Сума (успішні платежі) <span> за {humanReadableRange(range)}
									</span>:{' '}
									<strong>{totals.success.toFixed(2)}</strong> грн.</em>
								}
							</Col>
						</Row>
						{paymentsList.slice(0, maxCount).map((payment, index) => (
							<Row key={payment.order_id} className="my-3 py-2 p-sm-3 border rounded">
								<Col sm={3}>
									ID: {payment.order_id.slice(0, 8)}
								</Col>
								<Col sm={3}>
									{toHumanReadable('uk-ua', payment.create_date)}
								</Col>
								<Col sm={3}>
									{payment.status === 'success'
										? <span className="text-success">{payment.status}</span>
										: <span className="text-warning">
											{payment.status}: {payment.err_description}
										</span>
									}
								</Col>
								<Col sm={2} className="text-right">
									<span>{index + 1}</span>
								</Col>
								<Col sm={9} className="mt-3 text-muted">
									<small><em>{payment.description}</em></small>
								</Col>
								<Col sm={3} className="d-flex align-items-center justify-content-center">
									<strong>{payment.amount.toFixed(2)}<em>&nbsp;грн</em></strong>
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
		user: state.user,
		liqPayData: state.liqPayData
	}
}

const mapDispatchToProps = {
	setNotification,
	setFetchingData,
	getLiqPayData
}

export default connect (
	mapStateToProps,
	mapDispatchToProps
)(LiqPayPayments)
