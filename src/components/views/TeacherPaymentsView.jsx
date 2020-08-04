import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import teachersService from '../../services/teachers'
import { getTeacherData } from '../../reducers/teacherDataReducer'
import { setFetchingData, setNotification } from '../../reducers/notificationReducer'

import { Col } from 'react-bootstrap'

import CommonLayout from './CommonLayout'
import TeacherPaymentsList from '../payments/TeacherPaymentsList'

const TeacherPaymentsView = ({
	user, teacher,
	getTeacherData,
	setFetchingData,
	setNotification
}) => {

	const [teacherPayments, setTeacherPayments] = useState([])

	useEffect(() => {
		if (user) {
			setFetchingData(true)
			teachersService.setToken(user.token)
			getTeacherData(user.teacher)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}, [user, getTeacherData, setFetchingData, setNotification])

	useEffect(() => {
		if (teacher && teacher.payments) {

			const payments = teacher.payments

			if (payments.length > 0) {
				let result = payments.reduce((list, item) => {

					const found =
						list.find(existingItem =>
							existingItem.paymentDescr.pupil === item.paymentDescr.pupil)

					if (found) {
						const months = found.paymentDescr.months.concat(item.paymentDescr.months)
						found.amount += item.amount
						found.paymentDescr.months = [ ...new Set(months) ]
					} else {
						list.push({ ...item })
					}
					return list
				}, [])
				setTeacherPayments([ ...result ])
			}
		}
	}, [teacher])

	return (
		<CommonLayout>
			<h3 className="custom-font text-center">
				Список всіх ваших платежів
			</h3>

			{teacherPayments
				? <Col>
					<Col xs={12} className="text-right">
						Total: {teacherPayments.length} payments <br/>
					</Col>
					<Col>
						<TeacherPaymentsList payments={teacherPayments} />
					</Col>
				</Col>
				: <Col>You ain&apos;t got any payments</Col>
			}

		</CommonLayout>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		teacher: state.teacher
	}
}

const mapDispatchToProps = {
	getTeacherData,
	setFetchingData,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeacherPaymentsView)
