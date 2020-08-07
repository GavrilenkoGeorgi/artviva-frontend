import React, { Suspense, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import paymentService from '../../services/payment'
import { updatePaymentDescr } from '../../reducers/paymentsReducer'
import { getTeacherData } from '../../reducers/teacherDataReducer'

import { Container, Row, Col } from 'react-bootstrap'
import { BtnWithIcon } from '../common/buttons' // fix this btn
import { LoadingIndicator } from '../common'
import { PaymentDescrForm } from '../forms'
import { useEffect } from 'react'
import { setProcessingForm, setNotification } from '../../reducers/notificationReducer'

const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const TeacherPaymentsList = ({
	teacher, token, payments,
	processingForm,	setProcessingForm,
	setNotification, updatePaymentDescr, getTeacherData }) => {

	const [id, setId] = useState('')

	const [editModalShow, setEditModalShow] = useState(false)
	const [paymentToEdit, setPaymentToEdit] = useState({})

	const schoolYear =
		['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень']

	useEffect(() => {
		if (teacher) setId(teacher.id)
		if (token) paymentService.setToken(token)
	}, [token, teacher])

	const handlePayment = payment => {
		setPaymentToEdit(payment)
		setEditModalShow(true)
	}

	const updateDescription = values => {
		setProcessingForm(true)
		updatePaymentDescr(paymentToEdit.paymentDescr.id, values)
			.then(() => {
				setNotification({
					message: 'Квитанція про оплату успішно оновлена',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				setProcessingForm(false)
				setEditModalShow(false)
			})
		if (teacher.id) getTeacherData(id)
	}

	const timeStamp = date => {
		const result = moment(date).format('LLLL')
		return <>{result}</>
	}

	return <>
		{payments.map(payment => (
			<Container key={payment.id}>
				<Row className="my-4 border1 rounded">
					{/* Title */}
					<Col xs={10} className="px-0 py-2">
						<h4 className="d-inline1 custom-font payment-pupil-name">
							{payment.paymentDescr.pupil} {payment.amount} грн
						</h4>
					</Col>
					{/* Edit button */}
					<Col xs={2} className="border1 d-flex align-items-center justify-content-center">
						<BtnWithIcon
							variant="outline-success"
							type="button"
							icon="edit"
							label="edit"
							onClick={() => handlePayment(payment)}
						/>
					</Col>
					{/* Timestamp */}
					<Col xs={12} className="pb-2">
						<h5 className="small"><em>
							{timeStamp(payment.create_date)}
						</em></h5>
					</Col>
					{/* Specialty */}
					<Col xs={12} className="pb-2">
						<h5 className="text-muted">
							{payment.paymentDescr.specialty}
						</h5>
					</Col>
					{/* Original payment description */}
					<Col xs={12} className="py-2 px-3">
						<p className="original-payment-description">
							{payment.description}
						</p>
					</Col>
					{/* Months */}
					{schoolYear.map(month =>
						<Col key={month}
							xs={4}
							sm={3}
							className="m-0 p-0">
							{/*eslint-disable-next-line*/}
							<p className={`paid-month ${payment.paymentDescr.months.includes(month) ? 'highlighted' : ''}`}>
								{month}
							</p>
						</Col>
					)}
				</Row>
			</Container>
		))}
		{/* Description edit and delete modal */}
		<Suspense fallback={
			<LoadingIndicator
				animation="border"
				variant="primary"
				size="md"
			/>}>
			<LazyEntityEditModal
				subject="Редагування ім'я учня в платежі"
				show={editModalShow}
				onHide={() => setEditModalShow(false)}
			>
				<PaymentDescrForm
					payment={paymentToEdit}
					update={updateDescription}
					processing={processingForm}
				/>
			</LazyEntityEditModal>
		</Suspense>
	</>
}

const mapStateToProps = state => {
	return {
		processingForm: state.notification.processingForm,
		teacher: state.teacher
	}
}

const mapDispatchToProps = {
	updatePaymentDescr,
	getTeacherData,
	setProcessingForm,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeacherPaymentsList)
