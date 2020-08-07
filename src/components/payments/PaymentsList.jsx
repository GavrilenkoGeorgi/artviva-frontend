import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { initialisePayments } from '../../reducers/paymentsReducer'
import paymentService from '../../services/payment'
import { nestedSort } from '../../utils/arrayHelpers'

import { Container, Col, Form } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import TeacherPaymentsList from './TeacherPaymentsList'

const PaymentsList = ({
	user,
	payments,
	initialisePayments,
	setNotification
}) => {

	const unmounted = useRef(false)
	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const [isLoading, setIsLoading] = useState(true)
	const [paymentsData, setPaymentsData] = useState([])

	useEffect(() => {
		setPaymentsData(payments.sort(nestedSort('create_date', null, 'desc')))
	}, [payments])

	useEffect(() => {
		if (user) {
			// set token
			paymentService.setToken(user.token)
			// get list of payments
			initialisePayments()
				.catch(error => {
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${error.status} ${error.statusText}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => {
					if (!unmounted.current) setIsLoading(false)
				})
		}
	}, [user, setNotification, initialisePayments])

	const filter = ({ target }) => {
		const { name, value } = target
		const result = payments
			.filter(payment => payment.paymentDescr[name]
				.toUpperCase()
				.includes(value.toUpperCase()))
		setPaymentsData([...result])
	}

	return (
		<Container>
			{isLoading
				? <LoadingIndicator
					animation="border"
					variant="primary"
				/>
				: <>
					<h4 className="pt-3 text-center custom-font">
						Список усіх платежів.
					</h4>
					<Container className="py-2 px-0">
						{/* Sorting controls */}
						<Form>
							<em className="text-muted">Фільтр:</em>
							<Form.Row>
								<Col xs={12} sm={4} className="py-2">
									<Form.Control
										placeholder="Ім'я викладача"
										id="teacher-filter"
										name="teacher"
										onChange={event => filter(event)}
									/>
								</Col>
								<Col xs={12} sm={4} className="py-2">
									<Form.Control
										placeholder="Ім'я учня"
										id="pupil-filter"
										name="pupil"
										onChange={event => filter(event)}
									/>
								</Col>
								<Col xs={12} sm={4} className="py-2">
									<Form.Control
										placeholder="Фах"
										id="specialty-filter"
										name="specialty"
										onChange={event => filter(event)}
									/>
								</Col>
							</Form.Row>
							<Col className="text-right">
								<em className="text-muted">Загалом: {paymentsData.length} шт.</em>
							</Col>
						</Form>
					</Container>
					{paymentsData.length === 0
						? <p className="text-center text-muted py-3">
								Будь ласка, уточніть пошук, не знайдено жодного платежу.
						</p>
						: <TeacherPaymentsList
							token={user.token}
							payments={paymentsData}
						/>
					}
				</>
			}
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		payments: state.payments
	}
}

const mapDispatchToProps = {
	setNotification,
	initialisePayments
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PaymentsList)
