import React from 'react'
import { Helmet } from 'react-helmet'
import ContactMap from '../../common/ContactMap'
import departmentsData from '../../../data/departments.json'
import { Container, Row } from 'react-bootstrap'
import DepartmentCard from '../../common/DepartmentCard'
import ButtonLink from '../../common/buttons/ButtonLink'

import styles from './ContactsView.module.sass'

const ContactsView = () => {

	const { departments } = departmentsData
	const mapStyles = {
		height: '35rem'
	}

	const initialCenter = {
		lat: 50.454760,
		lng: 30.143868
	}

	return <>
		<Helmet>
			<title>Контакти школи мистецтв «АРТ ВІВА»</title>
			<meta
				name="description"
				content="Карта, яка показує всі наші відділення та їх контакти."
			/>
		</Helmet>
		<section className={styles.mapSection}>
			<h1 className='custom-font'>
				Філії
			</h1>
			<div className={styles.mapWrapper}>
				<div className={styles.mapContainer}>
					<ContactMap
						mapStyles={mapStyles}
						initialCenter={initialCenter}
						zoom={12}
						departments={departments}
					/>
				</div>
			</div>
			<div className={styles.ctaContainer}>
				<p className={`${styles.ctaLead} custom-font`}>
					Розкрийте свій музичний талант!
				</p>
				<p className={styles.ctaText}>
					Приєднуйтесь до нас та відкрийте безмежний світ музичного мистецтва.
					В нашій школі ми допоможемо вам освоїти класику та відкрити нові композиції.
					Запишіться вже зараз і дайте вашим мелодіям звучати!
				</p>
				<ButtonLink
					variant="primary"
					route="/#contact-form-anchor"
					label="Запишіться зараз"
					className="primary-color-shadow max-width-btn"
				/>
			</div>
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
		</section>
	</>
}

export default ContactsView
