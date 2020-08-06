import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import teachersService from '../../services/teachers'
import { getTeacherData } from '../../reducers/teacherDataReducer'
import { setFetchingData, setNotification } from '../../reducers/notificationReducer'

import { Col, Tab, Tabs } from 'react-bootstrap'

import CommonLayout from './CommonLayout'
import TeacherPaymentsList from '../payments/TeacherPaymentsList'

const TeacherPaymentsView = ({
	user, teacher,
	getTeacherData,
	setFetchingData,
	setNotification
}) => {

	const [paymentsByPupil, setPaymentsByPupil] = useState([])

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
				setPaymentsByPupil([ ...result ])
			}
		}
	}, [teacher])

	return (
		<CommonLayout>
			<Tabs defaultActiveKey="payments-by-pupil" id="payments-tabs">
				<Tab eventKey="payments-by-pupil" title="По учням">
					{paymentsByPupil
						? <Col>
							<Col xs={12} className="text-right">
								Всього: {paymentsByPupil.length} учні <br/>
							</Col>
							<Col>
								<TeacherPaymentsList payments={paymentsByPupil} />
							</Col>
						</Col>
						: <Col>Ви не маєте жодних платежів</Col>
					}
				</Tab>
				<Tab eventKey="all-payments" title="Список всіх платежів">
					{teacher.payments
						? <Col>
							<Col xs={12} className="text-right">
								Всього: {teacher.payments.length} платежі <br/>
							</Col>
							<Col>
								<TeacherPaymentsList
									token={user.token}
									teacherId={'teacher.id'}
									payments={teacher.payments}
								/>
							</Col>
						</Col>
						: <Col>Ви не маєте жодних платежів</Col>
					}
				</Tab>
			</Tabs>
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
