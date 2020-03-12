import React, { useState } from 'react'
import { Row, Col, Card, Image, Collapse } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'

const TeacherCard = ({ teacher }) => {
	const [open, setOpen] = useState(false)

	const openTeacherDescr = () => {
		setOpen(!open)
	}

	const showIcon = (icon) => {
		const iconStyle = 'teacher-social-icon fa-lg mx-2'

		switch (icon) {
		case 'facebook':
			return <FontAwesomeIcon icon={faFacebookF} className={iconStyle} />
		case 'instagram':
			return <FontAwesomeIcon icon={faInstagram} className={iconStyle} />
		case 'youtube':
			return <FontAwesomeIcon icon={faYoutube} className={iconStyle} />
		default:
			return null
		}
	}

	return (
		<Card key={teacher.id} className="mb-4">
			<Card.Body>
				<Row className="d-flex justify-content-center">
					<Col xs={8} sm={6} md={4} className="pb-3">
						<Image
							src={`img/teachers/${teacher.image}`}
							className="teacher-avatar"
							rounded
							alt={`Фото ${teacher.name}`}
						/>
					</Col>
					<Col xs={12} md={8}>
						<ul className="teacher-specs-list">
							<li className="d-flex justify-content-between align-items-center">
								<strong className="custom-font teacher-name text-left">
									{teacher.name}
								</strong>
								<span className="d-flex justify-content-end">
									{ teacher.social
										?
										teacher.social.map(social =>
											<a key={social.link} href={social.link}
												alt={`Посилання на профіль вчителя в соціальній мережі ${social.icon}`}
												aria-label={social.icon} target="_blank" rel="noopener noreferrer"
											>
												{showIcon(social.icon)}
											</a>
										)
										: null
									}
								</span>
							</li>
							<li>
								<em className="spec-title">Освіта: </em>
								<strong>{teacher.education}</strong>
							</li>
							<li>
								<em className="spec-title">Предмет: </em>
								<strong>{teacher.speciality}</strong>
							</li>
							<li>
								<p>
									{teacher.description.intro}
								</p>
								{teacher.description.text ?
									<>
										<Collapse in={open}>
											<div id="more-info">
												{teacher.description.text.map((paragraph, idx) =>
													<p key={idx} className="text-left more-info">
														{paragraph}
													</p>
												)}
											</div>
										</Collapse>
										<div className="text-right pt-3">
											<button
												className="more-teacher-info"
												onClick={() => openTeacherDescr()}
												aria-controls="more-info"
												aria-expanded={open}
											>
												{ open
													? <em><FontAwesomeIcon icon={faAngleUp} /></em>
													: <em>докладніше...</em>
												}
											</button>
										</div>
									</>
									: null
								}
							</li>
						</ul>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	)
}

TeacherCard.propTypes = {
	teacher: PropTypes.object.isRequired
}

export default TeacherCard
