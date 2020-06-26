import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import paymentService from '../../services/payment'
import { setNotification,	setProcessingForm, setFetchingData } from '../../reducers/notificationReducer'
import { schoolYearMonths } from '../../utils/datesAndTime'
import searchService from '../../services/search'
import specialtyService from '../../services/specialties'

import { Formik, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from 'uuid'

import { Col, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHryvnia } from '@fortawesome/free-solid-svg-icons'
import { BtnWithSpinner, Button } from '../common/buttons'
import { SimpleSpinner } from '../common/spinners'

const PaymentForm = ({
	processingForm,
	fetchingData,
	setNotification,
	setProcessingForm,
	setFetchingData }) => {

	const unmounted = useRef(false)
	const [teachersList, setTeachersList] = useState([])
	const [specialtiesNames, setSpecialtiesNames] = useState([])
	const [specilltiesData, setSpecialtiesData] = useState([])
	const months = schoolYearMonths('uk-ua')

	useEffect(() => {
		specialtyService.getAll()
			.then(data => {
				setSpecialtiesData(data)
				setSpecialtiesNames(data.map(specialty => specialty.title))
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
	}, [setNotification])

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const getTeachers = (value) => {
		if (value.length >= 2) {
			setFetchingData(true)
			const query = { value }
			searchService.teachers(query)
				.then((data) => {
					setTeachersList(data)
				})
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}

	let [orderData, setOrderData] = useState({
		teacher: null,
		specialty: null,
		months: [],
		cost: null,
		total: null
	})
	const [total, setTotal] = useState(null)

	// calculate total to show when filling the form
	const processOrderData = ({ target }) => {
		let months
		let position
		let priceData
		switch (target.name) {
		case 'teacher':
			setOrderData({ ...orderData, teacher: target.value })
			break
		case 'specialty':
			priceData = specilltiesData.find(specialty => specialty.title === target.value)
			setOrderData({ ...orderData, specialty: target.value, cost: priceData.cost })
			break
		case 'months':
			months = orderData.months
			position = months.indexOf(target.value)
			if ( ~position ) {
				months.splice(position, 1)
			} else {
				months.push(target.value)
			}
			setOrderData({ ...orderData, months })
			break
		default:
			return
		}
	}

	// when order data changes, calculate total
	useEffect(() => {
		const { specialty, months, cost } = orderData
		const preliminaryPaymentData = () => specialty && months ? true : false

		if (preliminaryPaymentData()) {
			setTotal(cost * months.length)
		}
	}, [orderData])

	const paymentFormEl = useRef(null)
	const [liqpayData, setLiqpayData] = useState({})

	// Send generate and send data to liqpay
	const handlePayment = async ({ teacher, pupil, specialty, months }) => {
		setProcessingForm(true)
		// compile payment data
		const paymentData = {
			action: 'pay',
			amount: total,
			currency: 'UAH',
			// eslint-disable-next-line
			description: `Оплата:${months.map(month => ` ${month}`)}. Викладач: ${teacher.trim()}. Учень: ${pupil.trim()}. Предмет: ${specialty}.`,
			order_id: uuidv4(),
			version: '3',
			language: 'uk',
			result_url: process.env.REACT_APP_LIQPAY_RESULT_URL
		}
		// make a payment
		paymentService.form(paymentData)
			.then(({ data, signature }) => {
				setLiqpayData({ ...liqpayData, data, signature })
				paymentFormEl.current.submit()
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (!unmounted.current) setProcessingForm(false)
			})
	}

	// Form schema
	const paymentFormSchema = Yup.object().shape({
		teacher: Yup.string()
			.oneOf(teachersList, 'Виберіть ім\'я викладача')
			.required('Виберіть ім\'я викладача'),
		pupil: Yup.string()
			.min(2, 'Не менш 3 символів')
			.max(45, 'Максимум 45 символів')
			.required('Введіть прізвище учня'),
		specialty: Yup.string()
			.oneOf(specialtiesNames, 'Виберіть предмет викладача')
			.required('Виберіть предмет викладача'),
		months: Yup.array()
			// .oneOf(months, 'Ви повинні вибрати не менше одного місяця.')
			.required('Ви повинні вибрати не менше одного місяця.')
	})

	// Form itself
	return (
		<Formik
			initialValues={{
				teacher: '',
				pupil: '',
				specialty: '',
				months: []
			}}
			onSubmit={async (values, { setErrors }) => {
				await handlePayment(values, setErrors)
			}}
			onReset={() => {
				setOrderData({ ...orderData, months: [], cost: null })
				setTotal(null)
			}}
			validationSchema={paymentFormSchema}
		>
			{({ handleSubmit,
				handleChange,
				handleBlur,
				handleReset,
				values,
				touched,
				errors,
			}) => (
				<Form
					ref={paymentFormEl}
					data-cy="payment-form"
					noValidate
					onSubmit={handleSubmit}
					onChange={event => processOrderData(event)}
					method="POST"
					action={process.env.REACT_APP_LIQPAY_API_URL}
					acceptCharset="utf-8"
					className="text-left"
				>

					{/* Teacher's name input */}
					<Form.Row>
						<Form.Group
							controlId="teacher-name-input"
							as={Col}
						>
							<Form.Label>Викладач
								{fetchingData
									? <SimpleSpinner
										className="ml-1"
										animation="grow"
										size="sm"
										variant="primary"
									/>
									: null
								}
							</Form.Label>
							<Form.Control
								type="text"
								name="teacher"
								list="teachers-list"
								autoComplete="off"
								data-cy="teacher-name-input"
								onChange={handleChange}
								onKeyUp={event => getTeachers(event.target.value)}
								onBlur={handleBlur}
								value={values.teacher}
								isValid={touched.teacher && !errors.teacher}
								isInvalid={touched.teacher && !!errors.teacher}
							/>
							<datalist id="teachers-list">
								{teachersList.map((name) =>
									<option key={name} value={name} />
								)}
							</datalist>
							<Form.Control.Feedback type="invalid">
								{errors.teacher}
							</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>

					{/* Pupil's name input */}
					<Form.Row className="d-flex justify-content-center">
						<Form.Group
							controlId="paymentForm.pupilNameInput"
							as={Col}
						>
							<Form.Label>
								Прізвище учня
							</Form.Label>
							<Form.Control
								type="text"
								name="pupil"
								data-cy="pupil-name-input"
								onChange={handleChange}
								value={values.pupil}
								isValid={touched.pupil && !errors.pupil}
								isInvalid={touched.pupil && !!errors.pupil}
							/>
							<Form.Control.Feedback type="invalid">
								{errors.pupil}
							</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>

					{/* Specialty input */}
					<Form.Row>
						<Form.Group
							controlId="specialty-input"
							as={Col}
						>
							<Form.Label>
								Предмет
							</Form.Label>
							<Form.Control
								as="select"
								name="specialty"
								data-cy="specialty-input"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.specialty}
								isValid={touched.specialty && !errors.specialty}
								isInvalid={touched.specialty && !!errors.specialty}
							>
								<option>Виберіть...</option>
								{specialtiesNames.map(specialty =>
									<option value={specialty} key={specialty}>{specialty}</option>
								)}
							</Form.Control>
							<Form.Control.Feedback type="invalid">
								{errors.specialty}
							</Form.Control.Feedback>
						</Form.Group>
					</Form.Row>

					<Form.Row>
						<FieldArray
							name='months'
							onChange={handleChange}
							onBlur={handleBlur}
							render={arrayHelpers => (
								<Col className="d-flex flex-wrap pt-3">
									{months.map(month => (
										<Col key={month} xs={4} className="my-2 px-1">
											<Form.Check
												inline
												custom
												name="months"
												type="checkbox"
												id={month}
												value={month}
												label={month}
												checked={values.months.includes(month)}
												isValid={touched.months && !errors.months}
												isInvalid={touched.months && !!errors.months}
												onChange={event => {
													if (event.target.checked) arrayHelpers.push(month)
													else {
														const index = values.months.indexOf(month)
														arrayHelpers.remove(index)
													}
												}}
											/>
										</Col>
									))}
									<ErrorMessage
										name="months"
										render={msg => (
											<span className="form-validation-error">
												{msg}
											</span>
										)}
									/>
								</Col>
							)}
						/>
					</Form.Row>

					<Form.Row className="py-3">
						<Col>
							{total
								? <>
									<h5 className="d-inline">
										{`Всього: ${total} `}
									</h5>
									<FontAwesomeIcon icon={faHryvnia} />
								</>
								: <h6 className="text-muted">
									<em>Заповніть форму для розрахунку вартості</em>
								</h6>
							}
						</Col>
					</Form.Row>

					<input type="hidden" name="data" value={liqpayData.data || ''} />
					<input type="hidden" name="signature" value={liqpayData.signature || ''} />
					<input type="hidden" name="language" value="uk" />

					{/* Pay button */}
					<Form.Row className="d-flex justify-content-around py-4">
						<Col>
							<BtnWithSpinner
								block
								type="submit"
								variant="primary"
								dataCy="pay-button"
								loadingState={processingForm}
								className="primary-color-shadow"
								label="Оплатити"
							/>
						</Col>
						<Col>
							<Button
								block
								variant="light"
								dataCy="reset-pay-form-btn"
								onClick={handleReset}
								label="Очистити"
							/>
						</Col>
					</Form.Row>

				</Form>
			)}
		</Formik>
	)
}

const mapStateToProps = (state) => {
	return {
		processingForm: state.notification.processingForm,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PaymentForm)
