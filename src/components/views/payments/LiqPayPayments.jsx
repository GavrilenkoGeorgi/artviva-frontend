import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import paymentService from '../../../services/payment'
import { setNotification, setFetchingData } from '../../../reducers/notificationReducer'
import moment from 'moment'
import { useScrollPosition } from '../../../hooks/scrollHooks'

import CommonLayout from '../CommonLayout'
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

	// eslint-disable-next-line
	const [range, setRange] = useState(defaultLiqPayDateRange(today))
	const [paymentsList, setPaymentsList] = useState([])

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

	return <CommonLayout>
		<Container>
			<Row>
				<Col xs={12}>
					<h1 className="text-success text-center">LiqPay</h1>
					<h6 className="text-muted text-center">дані по оплаті</h6>
				</Col>
				{paymentsList.length
					? <Container className="px-4">
						<Col className="text-right">
							<em>Загалом за останній місяць{' '}
								<strong>{paymentsList.length}</strong> шт.</em>
						</Col>
						{paymentsList.slice(0, maxCount).map(payment => (
							<Row key={payment.order_id} className="my-3 py-2 border rounded">
								<Col xs={6}>
									{moment(payment.create_date).format('LL')}
								</Col>
								<Col xs={6}>
									{payment.status === 'success'
										? <span className="text-success">{payment.status}</span>
										: <span className="text-warning">
											{payment.status}: {payment.err_description}
										</span>
									}
								</Col>
								<Col sm={9}>
									{payment.description}
								</Col>
								<Col sm={3}>
									{payment.amount} грн
								</Col>
							</Row>
						))}
					</Container>
					: <Container>
						<Col className="my-3 text-center">
							Завантаження...
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
