import React, { useState } from 'react'
import { Row, Col, Card, Collapse } from 'react-bootstrap'
import LazyLoadedImage from '../common/LazyLoadedImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'

const TeacherCard = ({ person }) => {
	const [open, setOpen] = useState(false)

	const openPersonDescr = () => {
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
		<Card className="mb-4">
			<Card.Body className='py-5'>
				<Row className="d-flex justify-content-around">
					<Col xs={6} sm={5} md={3} className="pb-3">
						<LazyLoadedImage
							src={`/img/teachers/${person.image}`}
							classList="teacher-avatar"
							rounded
							alt={`Фото ${person.name}`}
						/>
					</Col>
					<Col xs={12} md={8}>
						<ul className="teacher-specs-list">
							<li className="d-flex justify-content-between align-items-center">
								<strong className="custom-font teacher-name text-left">
									{person.name}
								</strong>
							</li>
							<li>
								<span className="d-flex justify-content-end">
									{ person.social
										?
										person.social.map(social =>
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
							<li className="teacher-job-title">
								{person.speciality.map((title, index) =>
									<div key={index} className="teacher-speciality">
										{title}
									</div>
								)}
							</li>
							<li className="teacher-info">
								<p>
									{person.description.intro}
								</p>
								<p>
									{person.description.moreInfo}
								</p>
								{person.description.text ?
									<>
										<Collapse in={open}>
											<div id="more-info">
												{person.description.text.map((paragraph, idx) =>
													<p key={idx} className="text-left more-info">
														{paragraph}
													</p>
												)}
											</div>
										</Collapse>
										<div className="text-right pt-3">
											<button
												className="more-teacher-info"
												onClick={() => openPersonDescr()}
												aria-controls="more-info"
												aria-expanded={open}
												data-cy="moreInfoBtn"
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
	person: PropTypes.object.isRequired
}

export default TeacherCard
