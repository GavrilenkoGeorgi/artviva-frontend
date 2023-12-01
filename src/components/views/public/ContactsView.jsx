import React from 'react'
import { Helmet } from 'react-helmet'
import { Container, Row } from 'react-bootstrap'
import ScrollAnimation from 'react-animate-on-scroll'

import departmentsData from '../../../data/departments.json'
import DepartmentCard from '../../common/DepartmentCard'
import ButtonLink from '../../common/buttons/ButtonLink'
import SendContactMessage from '../../contactMessage/SendContactMessage'

import styles from './ContactsView.module.sass'

const ContactsView = () => {

	const { departments } = departmentsData

	return <>
		<Helmet>
			<title>Контакти школи мистецтв «АРТ ВІВА»</title>
			<meta
				name='description'
				content='Наши відділення та їх контакти.'
			/>
		</Helmet>
		<section className={styles.mapSection}>
			<h1 className='custom-font'>
				Філії школи
			</h1>
			<Container className={styles.depCardsContainer}>
				<Row>
					{departments.map(department =>
						<DepartmentCard
							key={department.id}
							department={department}
						/>
					)}
				</Row>
			</Container>
			<ScrollAnimation
				animatePreScroll={false}
				animateOnce={true}
				animateIn='fadeInUp'
				delay={250}
			>
				<SendContactMessage />
			</ScrollAnimation>
			<ScrollAnimation
				animatePreScroll={false}
				animateOnce={true}
				animateIn='fadeInUp'
				delay={250}
			>
				<div className={styles.ctaContainer}>
					<h2 className={`${styles.ctaLead} custom-font`}>
						Розкрийте свій музичний талант!
					</h2>
					<p className={styles.ctaText}>
						Приєднуйтесь до нас та відкрийте безмежний світ музичного мистецтва.
						В нашій школі ми допоможемо вам освоїти класику та відкрити нові композиції.
						Запишіться вже зараз і дайте вашим мелодіям звучати!
					</p>
					<ButtonLink
						variant='success'
						route='/apply'
						label='Запишіться зараз'
						className='success-color-shadow'
					/>
				</div>
			</ScrollAnimation>
		</section>
	</>
}

export default ContactsView
