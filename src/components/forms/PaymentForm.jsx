import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import paymentService from '../../services/payment'
import { setNotification,	setProcessingForm,
	setSearchInProgress, setRecaptchaScore } from '../../reducers/notificationReducer'
import { schoolYearMonths } from '../../utils/datesAndTime'
import { calculatePercent } from '../../utils/formsUtils'
import searchService from '../../services/search'
import specialtyService from '../../services/specialties'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

import { Formik, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from 'uuid'

import { Col, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHryvnia, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { BtnWithSpinner, Button } from '../common/buttons'
import { SimpleSpinner } from '../common/spinners'
import { TextInput } from './components'
import { InfoModal } from '../common/modals'

import styles from './PaymentForm.module.sass'
import modalsTextContent from '../../data/modalsTextContent.json'

const PaymentForm = ({
	reCaptchaScore,
	processingForm,
	searching,
	setSearchInProgress,
	setNotification,
	setProcessingForm,
	setRecaptchaScore }) => {

	const unmounted = useRef(false)
	const { executeRecaptcha } = useGoogleReCaptcha()
	const [teachersList, setTeachersList] = useState([])
	const [specialtiesNames, setSpecialtiesNames] = useState([])
	const [specilltiesData, setSpecialtiesData] = useState([])
	const [paymentData, setPaymentData] = useState(null)
	const months = schoolYearMonths('uk-ua')

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	useEffect(() => {
		specialtyService.getAll()
			.then(data => {
				const list = data.filter(spec => spec.cost > 1)
				setSpecialtiesData(list)
				setSpecialtiesNames(list.map(specialty => specialty.title).reverse())
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
	}, [setNotification])

	const getRecaptchaScore = () => {
		executeRecaptcha('submit')
			.then(token => {
				setRecaptchaScore(token)
			})
			.catch(error => {
				const { message, variant } = { ...error.response.data }
				setNotification({
					message,
					variant: variant ? variant : 'danger'
				}, 5)
			})
	}

	const getTeachers = (value) => {
		if (value.length >= 2) {
			setSearchInProgress(true)
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
				.finally(() => setSearchInProgress(false))
		}
	}

	let [orderData, setOrderData] = useState({
		teacher: null,
		specialty: null,
		months: [],
		cost: null,
		total: 1,
		benefits: 0
	})
	const [total, setTotal] = useState(null)

	// calculate total to show on input
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
			setOrderData({
				...orderData,
				specialty: target.value,
				cost: priceData
					? priceData.cost + (priceData.cost * process.env.REACT_APP_CENTS_AMOUNT)
					: 0
			})
			break
		case 'benefits':
			setOrderData({ ...orderData, benefits: Number(target.value) })
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
		const { specialty, months, cost, benefits } = orderData
		const preliminaryPaymentData = () => specialty && months.length ? true : false

		if (preliminaryPaymentData()) {
			benefits
				? setTotal(calculatePercent(benefits, cost * months.length))
				: setTotal(cost * months.length)
		}
	}, [orderData])

	const showTotals = (total, percent) => (Number(total) + percent).toFixed(2)

	const paymentFormEl = useRef(null)
	const [liqpayData, setLiqpayData] = useState({})

	// Send payment data to liqpay
	const handlePayment = useCallback(async ({ teacher, pupil, specialty, months }) => {
		// compile payment data
		const percent = parseFloat(process.env.REACT_APP_LIQPAY_API_PERCENT)
		const amountToSend = total + (total/100 * percent)
		const paymentData = {
			action: 'pay',
			amount: amountToSend,
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
				setLiqpayData(liqpayData => ({ ...liqpayData, data, signature }))
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
	}, [total, setNotification, setProcessingForm])

	useEffect(() => {
		if (reCaptchaScore !== 0 && reCaptchaScore < .3) {
			setNotification({
				message: 'Ваша оцінка reCAPTCHA занизька, спробуйте оновити сторінку.',
				variant: 'warning'
			}, 5)
			setProcessingForm(false)
		} else if (paymentData && reCaptchaScore >= .3) {
			handlePayment(paymentData)
		}
	}, [reCaptchaScore, paymentData, handlePayment, setNotification, setProcessingForm])

	// Benefits info modal
	const [infoModalVis, setInfoModalVis] = useState(false)
	const [infoModalText, setInfoModalText] = useState({})
	const [infoModalTitle, setInfoModalTitle] = useState('')

	const openInfoModal = () => {
		const modalText = modalsTextContent.paymentBenefitsInfo
		setInfoModalTitle(modalText.title)
		setInfoModalText(modalText.text)
		setInfoModalVis(true)
	}

	// Form schema
	const paymentFormSchema = Yup.object().shape({
		teacher: Yup.string().trim()
			.oneOf(teachersList, 'Виберіть ім\'я викладача')
			.required('Виберіть ім\'я викладача'),
		pupil: Yup.string().trim()
			.min(2, 'Не менш 3 символів')
			.max(45, 'Максимум 45 символів')
			.required('Введіть прізвище учня'),
		specialty: Yup.string()
			.oneOf(specialtiesNames, 'Виберіть предмет викладача')
			.required('Виберіть предмет викладача'),
		benefits: Yup.number()
			.min(0, 'No benefits')
			.max(100, 'Too much percent'),
		months: Yup.array()
			.required('Ви повинні вибрати не менше одного місяця.')
	})

	// Form itself
	return (
		<>
			<Formik
				initialValues={{
					teacher: '',
					pupil: '',
					specialty: '',
					months: [],
					benefits: 0
				}}
				onSubmit={async (values) => {
					setProcessingForm(true)
					setPaymentData(values)
					getRecaptchaScore()
				}}
				onReset={() => {
					setOrderData({ ...orderData, months: [], cost: null, benefits: 0 })
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
								<Form.Label>Викладач<span className="form-required-mark"> *</span>
									{searching
										? <SimpleSpinner
											className="ml-1"
											size="sm"
											variant="success"
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
									onKeyUp={event => getTeachers(event.target.value.trim())}
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

						<TextInput
							label="Прізвище учня"
							name="pupil"
							dataCy="pupil-name-input"
							onChange={handleChange}
							value={values.pupil}
							touched={touched.pupil}
							errors={errors.pupil}
						/>

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
									custom
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
							<Form.Group
								controlId="benefits-input"
								as={Col}
							>
								<Form.Label className={styles.wideLabel}>
									<span>
										Пільги?
									</span>
									<FontAwesomeIcon
										icon={faInfoCircle}
										className={styles.infoIcon}
										onClick={() => openInfoModal('benefits')}
									/>
								</Form.Label>
								<Form.Control
									as="select"
									custom
									name="benefits"
									data-cy="benefits-input"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.benefits}
									isValid={touched.benefits && !errors.benefits}
									isInvalid={touched.benefits && !!errors.benefits}
								>
									<option value={0}>Виберіть...</option>
									<option value={50}>Моя дитина має пільги у розмірі 50%</option>
								</Form.Control>
								<Form.Control.Feedback type="invalid">
									{errors.benefits}
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

						<Form.Row className="py-3 d-flex justify-content-center">
							{total
								? <>
									<Col xs={11} className={styles.paymentTotalMessage}>
										Всього: <span className={styles.totalAmount}>
											{showTotals(calculatePercent(process.env.REACT_APP_LIQPAY_API_PERCENT, total)
												.toFixed(2), total)}
										</span>
									</Col>
									<Col xs={1} className="d-flex align-items-center">
										<FontAwesomeIcon icon={faHryvnia} />
									</Col>
								</>
								: <p className={styles.paymentTotalMessage}>
									<em>Заповніть форму для розрахунку вартості</em>
								</p>
							}
							<Col xs={12} className="text-right">
								<em className="text-muted small">
									В тому числі відсоток 1.75% за зручність, покращений сервіс.
								</em>
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
			<InfoModal
				title={infoModalTitle}
				text={infoModalText}
				centered
				show={infoModalVis}
				btnLabel={'Зрозуміло'}
				onHide={() => setInfoModalVis(!infoModalVis)}
			/>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		processingForm: state.notification.processingForm,
		searching: state.notification.searching,
		reCaptchaScore: state.notification.reCaptchaScore,
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm,
	setSearchInProgress,
	setRecaptchaScore
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PaymentForm)
