import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { deletePupil } from '../../reducers/pupilsReducer'
import pupilsService from '../../services/pupils'
import { setNotification } from '../../reducers/notificationReducer'
import moment from 'moment'

import { Container, Row, Col, Collapse, Button, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import LoadingIndicator from '../common/LoadingIndicator'
import PupilForm from '../forms/PupilForm'
import EntityControlButtons from '../common/EntityControlButtons'
import Emoji from '../common/Emoji'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Pupil = ({ user, pupil, deletePupil, setNotification }) => {

	const [open, setOpen] = useState(false)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const unmounted = useRef(false)
	const cardStyle = 'mb-3'

	// set auth token
	useEffect(() => {
		pupilsService.setToken(user.token)
		return () => { unmounted.current = true }
	}, [user])

	const handleDelete = id => {
		setIsDeleting(true)
		deletePupil(id)
			.then(() => {
				setNotification({
					message: 'Учень успішно видален.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
				setIsDeleting(false)
				setDeleteModalShow(false)
			})
			.finally(() => {
				if (!unmounted) setIsDeleting(false)
			})
	}

	const pupilTitleInfo = pupil => {
		return `${pupil.name}: ${pupil.specialty
			? pupil.specialty.title
			: null}
			${pupil.artSchoolClass
		? pupil.artSchoolClass
		: null } клас`
	}

	return (
		<>
			<Button
				block
				onClick={() => setOpen(!open)}
				aria-controls="pupil-collapse"
				aria-expanded={open}
				variant="link"
				className="d-flex justify-content-between align-items-center"
			>
				<span className="text-left">
					{pupilTitleInfo(pupil)}
				</span>
				{ open
					? <FontAwesomeIcon icon={faAngleUp} />
					: <FontAwesomeIcon icon={faAngleDown} />
				}
			</Button>
			<Collapse in={open}>
				<Container>
					<Row>
						<Col>

							{/* Contact info */}
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

							{/* Personal info */}
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

							{/* School info */}
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
									<Card.Text>
										Класи ДШМ: {pupil.schoolClasses.map(item =>
											<span className="pl-3 d-block" key={item.id}>
												{item.title}
											</span>
										)}
									</Card.Text>
								</Card.Body>
							</Card>

							{/* Parents info */}
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

					{/* Control buttons */}
					<Row>
						<EntityControlButtons
							openEditModal={() => setEditModalShow(true)}
							openDeleteModal={() => setDeleteModalShow(true)}
						/>
					</Row>
				</Container>
			</Collapse>

			{/* Pupil edit and delete modal */}
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				<LazyEntityEditModal
					subject="учня"
					subjectid={pupil.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<PupilForm
						closeModal={() => setEditModalShow(false)}
						pupil={pupil}
						mode="edit" />
				</LazyEntityEditModal>
				<LazyEntityDeleteModal
					subject="учня"
					subjectid={pupil.id}
					valuetoconfirm={pupil.name}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={isDeleting}
					onHide={() => setDeleteModalShow(false)}
				/>
			</Suspense>
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification,
	deletePupil
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pupil)
