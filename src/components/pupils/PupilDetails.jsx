import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { setNotification, setFetchingData } from '../../reducers/notificationReducer'
import pupilsService from '../../services/pupils'
import moment from 'moment'

import { Container, Row, Col, Card } from 'react-bootstrap'
import { CommonLayout } from '../views'
import { useState } from 'react'
import Emoji from '../common/Emoji'

const PupilDetails = ({ user, setFetchingData, setNotification, match }) => {

	const cardStyle = 'my-3'

	const componentIsMounted = useRef(true)
	const [pupil, setPupil] = useState({})

	useEffect(() => {
		if (user) {
			setFetchingData(true)
			pupilsService.setToken(user.token)
			pupilsService.pupilDetailsById(match.params.id)
				.then((pupil) => {
					setPupil(pupil)

				})
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше: ${message}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => {
					if (componentIsMounted.current) setFetchingData(false)
				})
		}

	},[user, match.params.id, setNotification, setFetchingData])

	return <CommonLayout>
		<h1 className="text-center custom-font">Детали учня</h1>
		<h2 className="text-center text-muted custom-font">{pupil.name}</h2>
		<Container>
			<Row>
				<Col lg={6} className="px-1">
					{/*Contact info*/}
					<Card className={cardStyle}>
						<Card.Body>
							<Card.Subtitle className="text-muted mb-2">
								<Emoji label="Magnifying Glass Tilted Right" emoji={'🔎'} /> Контактні дані
							</Card.Subtitle>
							<Card.Text>
								Дата подяння заяві: {moment(pupil.createdAt).format('LL')}
							</Card.Text>
							<Card.Text>
								Ім&apos;я контактної особі: {pupil.applicantName}
							</Card.Text>
							<Card.Text>
								Її email: <a href={`mailto:${pupil.contactEmail}`}>{pupil.contactEmail}</a>
							</Card.Text>
							<Card.Text>
								Домашня адреса: {pupil.homeAddress}
							</Card.Text>
						</Card.Body>
					</Card>

					{/*Personal info*/}
					<Card className={cardStyle}>
						<Card.Body>
							<Card.Subtitle className="text-muted mb-2">
								<Emoji label="Memo" emoji={'📝'} /> Персональна інформація
							</Card.Subtitle>
							<Card.Text>
								Стать: {pupil.gender === 'Чоловіча'
									? <Emoji label="Man" emoji={'👨'} />
									: <Emoji label="Woman" emoji={'👩'} />}
									&nbsp;{pupil.gender}
							</Card.Text>
							<Card.Text>
								Возраст: {moment(pupil.dateOfBirth).fromNow().split(' ')[0]} років
							</Card.Text>
							<Card.Text>
								День народження: {moment(pupil.dateOfBirth).format('Do MMMM YYYY')}
							</Card.Text>
							<Card.Text>
								Надав усі документи?&nbsp;
								{pupil.docsPresent
									? <Emoji label="Check Mark" emoji={'✔️'} />
									: <Emoji label="Cross Mark" emoji={'❌'} />
								}
							</Card.Text>
							<Card.Text>
								Зарахован до навчання?&nbsp;
								{pupil.currentlyEnrolled
									? <Emoji label="Check Mark" emoji={'✔️'} />
									: <Emoji label="Cross Mark" emoji={'❌'} />
								}
							</Card.Text>
							<Card.Text>
								Випустився зі школи?&nbsp;
								{pupil.graduated
									? <Emoji label="Check Mark" emoji={'✔️'} />
									: <Emoji label="Cross Mark" emoji={'❌'} />
								}
							</Card.Text>
							<Card.Text>
								Відрахований?&nbsp;
								{pupil.suspended
									? <Emoji label="Check Mark" emoji={'✔️'} />
									: <Emoji label="Cross Mark" emoji={'❌'} />
								}
							</Card.Text>
							<Card.Text>
								Пільги: {pupil.hasBenefit}%
							</Card.Text>
							{pupil.info
								? <Card.Text>
									<Emoji label="Pencil" emoji={'✏️'} /> {pupil.info}
								</Card.Text>
								: null
							}
						</Card.Body>
					</Card>
				</Col>

				<Col lg={6} className="px-1">
					{/*School info*/}
					<Card className={cardStyle}>
						<Card.Body>
							<Card.Subtitle className="text-muted mb-2">
								<Emoji label="Graduation Cap" emoji={'🎓'} /> Навчання
							</Card.Subtitle>
							<Card.Text>
								ЗОШ: {pupil.mainSchool} {pupil.mainSchoolClass} клас
							</Card.Text>
							<Card.Text>
								Музична школа: {pupil.artSchoolClass} клас
							</Card.Text>
							{pupil.specialty
								? <Card.Text>
									Фах: {pupil.specialty.title}
								</Card.Text>
								: null}
							{pupil.schoolClasses
								?
								<Card.Text>
									Класи ДШМ: {pupil.schoolClasses.map(item =>
										<span className="pl-3 d-block" key={item.id}>
											{item.title}
										</span>
									)}
								</Card.Text>
								: null
							}
						</Card.Body>
					</Card>

					{/* Parents info*/}
					<Card className={cardStyle}>
						<Card.Body>
							<Card.Subtitle className="text-muted mb-2">
								<Emoji label="Family" emoji={'👪'} /> Батьки
							</Card.Subtitle>
							<Card.Text>
								<strong>{pupil.fathersName}</strong><br />
								{pupil.fathersPhone}<br />
								{pupil.fathersEmploymentInfo}<br />
							</Card.Text>
							<Card.Text>
								<strong>{pupil.mothersName}</strong><br />
								{pupil.mothersPhone}<br />
								{pupil.mothersEmploymentInfo}
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>
	</CommonLayout>
}

const mapStateToProps = state => {
	return {
		user: state.user,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setFetchingData,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilDetails)
