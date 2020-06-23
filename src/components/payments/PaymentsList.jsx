import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { initialisePayments } from '../../reducers/paymentsReducer'
import paymentService from '../../services/payment'
import { nestedSort } from '../../utils/arrayHelpers'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col, Form } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import PaymentCard from './PaymentCard'

const PaymentsList = ({
	user,
	payments,
	initialisePayments,
	setNotification
}) => {

	const [isLoading, setIsLoading] = useState(true)
	const [paymentsData, setPaymentsData] = useState([])
	const defaultSortOrder = {
		pupil: false,
		teacher: false,
		specialty: false,
		create_date: false,
		amount: false
	}
	const [sortOrder, setSortOrder] = useState(defaultSortOrder)

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
				.finally(() => setIsLoading(false))
		}
	}, [user, setNotification, initialisePayments])

	const sort = ({ id: field }) => {
		const paymentDescrFields = ['teacher', 'pupil', 'specialty']
		setSortOrder({ ...defaultSortOrder, [field]: !sortOrder[field] })
		const search = {
			field,
			sortOrder: sortOrder[field] ? 'desc' : 'asc'
		}
		if (paymentDescrFields.includes(search.field)) {
			paymentsData.sort(nestedSort('paymentDescr', search.field, search.sortOrder))
		} else {
			paymentsData.sort(nestedSort(search.field, null, search.sortOrder))
		}
	}

	const filter = ({ target }) => {
		const { name, value } = target
		const result = payments
			.filter(payment => payment.paymentDescr[name]
				.toUpperCase()
				.includes(value.toUpperCase()))
		setPaymentsData([...result])
	}

	const sortLabel = (label, fieldName) => {
		return (
			<Row>
				<Col>{label}&nbsp;
					{sortOrder[fieldName]
						? <FontAwesomeIcon icon={faAngleDown} className="text-primary"/>
						: <FontAwesomeIcon icon={faAngleUp} />
					}
				</Col>
			</Row>
		)
	}

	return (
		<>
			{isLoading
				? <LoadingIndicator
					animation="border"
					variant="primary"
				/>
				: <>
					<h5 className="pt-3 text-center">
						Список усіх платежів.
					</h5>
					<Container className="py-2 border border-secondary rounded">
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
							<p className="text-muted pt-3">
								Сортування:
							</p>
							<Form.Check
								custom
								inline
								type="checkbox"
								id="create_date"
								label={sortLabel('Дата оплати', 'create_date')}
								checked={sortOrder.create_date}
								onChange={event => sort(event.target)}
							/>
							<Form.Check
								custom
								inline
								type="checkbox"
								id="amount"
								label={sortLabel('Сума', 'amount')}
								checked={sortOrder.amount}
								onChange={event => sort(event.target)}
							/>
							<p className="text-muted pt-3">За алфавітом:</p>
							<Form.Check
								custom
								inline
								type="checkbox"
								id="teacher"
								label="Ім'я викладача"
								checked={sortOrder.teacher}
								onChange={event => sort(event.target)}
							/>
							<Form.Check
								custom
								inline
								type="checkbox"
								id="pupil"
								label="Ім'я учня"
								checked={sortOrder.pupil}
								onChange={event => sort(event.target)}
							/>
							<Form.Check
								custom
								inline
								type="checkbox"
								id="specialty"
								label="Фах"
								checked={sortOrder.specialty}
								onChange={event => sort(event.target)}
							/>
						</Form>
					</Container>
					{paymentsData.length === 0
						? <p className="text-center text-muted py-3">
								Будь ласка, уточніть пошук, не знайдено жодного платежу.
						</p>
						: paymentsData.map(payment =>
							<PaymentCard key={payment.id} payment={payment} />
						)
					}
				</>
			}
		</>
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
