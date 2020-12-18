import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { getTeacherData } from '../../../reducers/teacherDataReducer'
import { setFetchingData, setNotification } from '../../../reducers/notificationReducer'

import { Col, Tab, Tabs } from 'react-bootstrap'

import CommonLayout from '../../CommonLayout'
import TeacherPaymentsList from '../../payments/TeacherPaymentsList'

const TeacherPaymentsView = ({
	user, teacher,
	getTeacherData,
	setFetchingData,
	setNotification
}) => {

	// eslint-disable-next-line
	const [paymentsByPupil, setPaymentsByPupil] = useState([])

	useEffect(() => {
		if (user && user.teacher) {
			setFetchingData(true)
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
			<Tabs defaultActiveKey="all-payments" id="payments-tabs">
				{/*<Tab eventKey="payments-by-pupil" title="По учням">
					{paymentsByPupil.length
						? <Col>
							<Col xs={12} className="text-right">
								Всього: {paymentsByPupil.length} учні <br/>
							</Col>
							<Col>
								<TeacherPaymentsList payments={paymentsByPupil} />
							</Col>
						</Col>
						: <Col className="school-explained-section text-center">
							<p>Ви ще маєте жодного платежу</p>
						</Col>
					}
				</Tab>*/}
				<Tab eventKey="all-payments" title="Список всіх платежів">
					{teacher && teacher.payments.length
						? <Col>
							<Col xs={12} className="mt-3 text-right">
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
						: <Col className="school-explained-section text-center">
							<p>Ви ще маєте жодного платежу</p>
						</Col>
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

const MemodTeacherPaymentsView = React.memo(TeacherPaymentsView)

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MemodTeacherPaymentsView)
