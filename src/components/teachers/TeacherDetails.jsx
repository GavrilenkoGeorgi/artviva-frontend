import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import teachersService from '../../services/teachers'
import { setNotification } from '../../reducers/notificationReducer'
import moment from 'moment'
import 'moment-precise-range-plugin'
import { nestedSort } from '../../utils/arrayHelpers'

import { Container, Row, Col, Card, Form } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import PaymentDescr from './PaymentDescr'
import Emoji from '../common/Emoji'

const TeacherDetails = ({ user, match, teacher, setNotification }) => {

	const [teacherDetails, setTeacherDetails] = useState(null)
	const [teacherExperience, setTeacherExperience] = useState({})
	const [descPayPupilNameSortOrder, setDescPayPupilNameSortOrder] = useState(false)
	const [descPayDateSortOrder, setDescPayDateSortOrder] = useState(true)

	const cardStyle = 'mb-3'

	// date now
	const today = moment(new Date())
	// start and end date of the current school year
	const startOfSchoolYear = moment([today.get('year') - 1, 8, 1])
	const endOfSchoolYear = moment([today.get('year'), 5, 1])
	const dates = {
		today,
		startOfSchoolYear,
		endOfSchoolYear
	}

	const calcXpToDate = useCallback(({ employmentDate, experienceToDate }) => {
		const date = moment()
		const { years, months, days } = experienceToDate
		const adjustedExperienceDate = moment(employmentDate).subtract({ years, months, days })
		const experience = moment.preciseDiff(adjustedExperienceDate, date, true)
		setTeacherExperience(experience)
	}, [])

	const sortByField = ({ checked, id }) => {
		const order = checked ? 'desc' : 'asc'
		switch (id) {
		case 'pupil':
			setDescPayPupilNameSortOrder(checked)
			setTeacherDetails({
				...teacherDetails,
				payments: teacherDetails.payments.sort(nestedSort('paymentDescr', id, order))
			})
			break
		case 'create_date':
			setDescPayDateSortOrder(checked)
			setTeacherDetails({
				...teacherDetails,
				payments: teacherDetails.payments.sort(nestedSort(id, null, order))
			})
			break
		default:
			console.warn('Check sort criteria.')
		}
	}

	useEffect(() => {
		if (teacher.id) {
			setTeacherDetails(teacher)
			setTeacherDetails({
				...teacher,
				payments: teacher.payments.sort(nestedSort('create_date', null, 'desc'))
			})
			calcXpToDate(teacher)
		}
	}, [teacher, calcXpToDate])

	useEffect(() => {
		if (user && match) {
			teachersService.setToken(user.token)
			teachersService.getById(match.params.id)
				.then((data) => {
					setTeacherDetails({
						...data,
						payments: data.payments.sort(nestedSort('create_date', null, 'desc'))
					})
					calcXpToDate(data)
				})
				.catch(error => {
					const notification = JSON.parse(error.request.responseText)
					setNotification({
						message: notification.error,
						variant: 'danger'
					}, 5)
				})
		}
	// eslint-disable-next-line
	}, [user])

	return (
		<>
			{teacherDetails
				? <Container className="pt-3">
					<Row>
						<Col>
							<h6>
								{/* eslint-disable-next-line */}
								<Emoji label="Magnifying Glass Tilted Right" emoji={'🔎'} /> Детальна інформація про вчітеля
							</h6>
							{/* Teacher info */}
							<Card className={cardStyle}>
								<Card.Body>
									<Card.Text>
										<strong>{teacherDetails.name}</strong> - {teacherDetails.employeeType}<br />
										{teacherDetails.specialties.map(specialty => (
											<span key={specialty.id}>{specialty.title}</span>
										))}
									</Card.Text>
									<Card.Text>
										Працює з: {moment(teacherDetails.employmentDate).format('LL')}
									</Card.Text>
									<Card.Text>
										{/* eslint-disable-next-line */}
										Повний стаж с урахуванням додаткового: {teacherExperience.years} років {teacherExperience.months} місяців {teacherExperience.days} днів
									</Card.Text>
									<Card.Text>
										{/* eslint-disable-next-line */}
										Додатковій стаж: {teacherDetails.experienceToDate.years} років {teacherDetails.experienceToDate.months} місяців {teacherDetails.experienceToDate.days} днів
									</Card.Text>
									<Card.Text>
										Розряд: {teacherDetails.category}
									</Card.Text>
									<Card.Text>
										{teacherDetails.isAdministration ? 'Адміністрація ' : null }
										{teacherDetails.isRetired ? 'Пенсионер ' : null }
										{teacherDetails.employeeIsAStudent ? 'Навчается у ВНЗ' : null }
									</Card.Text>
									<Card.Text>
										Кваліфікаційна категорія: {teacherDetails.qualification}
									</Card.Text>
									<Card.Text>
										Педагогічне звання: {teacherDetails.teacherTitle}
									</Card.Text>
									<Card.Text>
										Наукова ступінь: {teacherDetails.scienceDegree}
									</Card.Text>
								</Card.Body>
							</Card>

							{/* Contacts */}
							<Card className={cardStyle}>
								<Card.Body>
									<Card.Subtitle className="mb-2 text-muted">
										<Emoji label="Telephone Receiver" emoji={'📞'} /> Контактні дані
									</Card.Subtitle>
									<Card.Text>
										Електронна пошта: <a href={`mailto:${teacherDetails.contactEmail}`}>
											{teacherDetails.contactEmail}
										</a>
									</Card.Text>
									<Card.Text>
										Телефонний №: {teacherDetails.phone}
									</Card.Text>
									<Card.Text>
										{/* eslint-disable-next-line */}
										Місцевість проживання: {teacherDetails.residence === 'Місто'
											? <Emoji label="Cityscape" emoji={'🏙️'} />
											: <Emoji label="House with Garden" emoji={'🏡'} />}
											&nbsp;{teacherDetails.residence}
									</Card.Text>
								</Card.Body>
							</Card>

							{/* Personal info */}
							<Card className={cardStyle}>
								<Card.Body>
									<Card.Subtitle className="mb-2 text-muted">
										<Emoji label="Memo" emoji={'📝'} /> Персональна інформація
									</Card.Subtitle>
									<Card.Text>
										{/* eslint-disable-next-line */} {/* no gender diversity ( */}
										Стать: {teacherDetails.gender === 'Чоловіча'
											? <Emoji label="Man" emoji={'👨'} />
											: <Emoji label="Woman" emoji={'👩'} />}
											&nbsp;{teacherDetails.gender}
									</Card.Text>
									<Card.Text>
										Сімеїний стан: {teacherDetails.maritalStatus}
									</Card.Text>
								</Card.Body>
							</Card>

							{/* Education info */}
							<Card className={cardStyle}>
								<Card.Body>
									<Card.Subtitle className="mb-2 text-muted">
										<Emoji label="Graduation Cap" emoji={'🎓'} /> Освіта
									</Card.Subtitle>
									<Card.Text>
										Навчальний заклад: {teacherDetails.university}
									</Card.Text>
									<Card.Text>
										Освітній рівень: {teacherDetails.educationType}
									</Card.Text>
									<Card.Text>
										Освітньо-кваліфікаційний рівень: {teacherDetails.educationDegree}
									</Card.Text>
								</Card.Body>
							</Card>

							{/* Additinal info */}
							<Card className={cardStyle}>
								<Card.Body>
									<Card.Subtitle className="mb-2 text-muted">
										<Emoji label="Green Book" emoji={'📗'} /> Додаткова інформація
									</Card.Subtitle>
									<Card.Text>
										{teacherDetails.info || 'Немає'}
									</Card.Text>
								</Card.Body>
							</Card>

							<h6>
								<Emoji label="Dollar Banknote" emoji={'💵'} /> Платежі:
							</h6>
							{/* Sorting controls */}
							<Form>
								<Form.Check
									custom
									inline
									type="checkbox"
									id="pupil"
									label="Ім'я учня Я-А"
									checked={descPayPupilNameSortOrder}
									onChange={event => sortByField(event.target)}
								/>
								<Form.Check
									custom
									inline
									type="checkbox"
									id="create_date"
									label={`Дата оплати ${descPayDateSortOrder ? ' - нові вгорі' : ''}`}
									checked={descPayDateSortOrder}
									onChange={event => sortByField(event.target)}
								/>
							</Form>

							{teacherDetails.payments.map(payment => (
								<Container
									key={payment.id}
									className="payment-description-container border rounded my-2"
								>
									<PaymentDescr
										data={payment}
										dates={dates}
									/>
								</Container>
							))}
						</Col>
					</Row>
				</Container>
				: <>
					{ match
						? <LoadingIndicator animation="border" variant="primary" />
						: null
					}
				</>
			}
		</>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		teacher: state.teacher
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TeacherDetails)
