import React, { useState } from 'react'
import { Row, Col, Card, Collapse } from 'react-bootstrap'
import LazyLoadedImage from '../common/LazyLoadedImage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faInstagram, faYoutube, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import PropTypes from 'prop-types'
import styles from './TeacherCard.module.sass'

const TeacherCard = ({ person }) => {
	const [open, setOpen] = useState(false)

	const openPersonDescr = () => {
		setOpen(!open)
	}

	const showIcon = (icon) => {

		switch (icon) {
		case 'facebook':
			return <FontAwesomeIcon icon={faFacebookF} />
		case 'instagram':
			return <FontAwesomeIcon icon={faInstagram} />
		case 'youtube':
			return <FontAwesomeIcon icon={faYoutube} />
		case 'linkedin':
			return <FontAwesomeIcon icon={faLinkedinIn} />
		default:
			return null
		}
	}

	return (
		<Card className="mb-4">
			<Card.Body className='p-lg-5'>
				<Row className="d-flex justify-content-around">
					<Col xs={6} sm={5} md={3} className="pb-3">
						<LazyLoadedImage
							src={`/img/teachers/${person.image}`}
							classList={styles.teacherAvatar}
							rounded
							alt={`Фото ${person.name}`}
						/>
					</Col>
					<Col xs={12} md={8}>
						<ul className={styles.teacherSpecsList}>
							<li className={styles.teacherNameRow}>
								<strong className={styles.teacherName}>
									{person.name}
								</strong>
							</li>
							<li>
								<span className={styles.socialIconsRow}>
									{person.social
										?
										person.social.map(social =>
											<a key={social.link} href={social.link}
												className={styles.teacherSocialIcon}
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
							<li className={styles.teacherJobTitle}>
								{person.speciality.map((title, index) =>
									<div key={index} className={styles.teacherSpeciality}>
										{title}
									</div>
								)}
							</li>
							{person.timePeriod
								? <li className={styles.teacherWorkingPeriod}>
									{person.timePeriod}
								</li>
								: null
							}
							<li className={styles.teacherInfo}>
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
													<p key={idx} className={styles.moreInfo}>
														{paragraph}
													</p>
												)}
											</div>
										</Collapse>
										<div className="text-right pt-3">
											<button
												className={styles.moreTeacherInfo}
												onClick={() => openPersonDescr()}
												aria-controls="more-info"
												aria-expanded={open}
												data-cy="moreInfoBtn"
											>
												{ open
													? <em><FontAwesomeIcon icon={faAngleUp} /></em>
													: <em>ще...</em>
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
