import React from 'react'
import { Container, Col, Row, Image } from 'react-bootstrap'
import ScrollAnimation from 'react-animate-on-scroll'

import { ReactComponent as OrigamiIcon } from '../../svg/origami.svg'
import { ReactComponent as EditIcon } from '../../svg/edit.svg'
import { ReactComponent as LoveSongIcon } from '../../svg/love-song.svg'
import { ReactComponent as Enrollment } from '../../svg/enrollment.svg'
import ButtonLink from '../common/buttons/ButtonLink'

import styles from './TextIntro.module.sass'

const TextIntro = () => {
	return (
		<Container>
			<Row className="d-flex justify-items-center">
				<Col xs={12} className={styles.logoImgContainer}>
					<Image
						src="img/logo/artviva_logo_crop.webp"
						className={styles.logoImg}
						alt="Лого ArtViva"
					/>
				</Col>
				<Col sm={6} className={styles.mainTextItem}>
					<div className={styles.animIconContainer}>
						<ScrollAnimation animateIn="fadeIn">
							<OrigamiIcon />
						</ScrollAnimation>
					</div>
					<p>
						Сьогодні Школа мистецтв «АРТ ВІВА» на чолі з
						Лілією Робакідзе — сучасний заклад початкової
						мистецької освіти, де на музичному,
						хореографічному та художньому відділеннях
						40 досвідчених, дипломованих викладачів та
						концертмейстерів навчають майже 500 дітей.
					</p>
				</Col>
				<Col sm={6} className={styles.mainTextItem}>
					<div className={styles.animIconContainer}>
						<ScrollAnimation animateIn="fadeIn">
							<EditIcon />
						</ScrollAnimation>
					</div>
					<p>
						Дирекція школи у цей складний час, прикладає
						максимум зусиль для того, щоб діти почували
						себе комфортно та в безпеці, та працює над
						покращенням матеріальної бази, впровадження
						новітніх технологій та підняття якості
						навчання відповідно до нових освітніх програм.
					</p>
				</Col>
				<Col xs={12} className={styles.mainTextItem}>
					<div className={styles.animIconContainer}>
						<ScrollAnimation animateIn="fadeIn">
							<LoveSongIcon />
						</ScrollAnimation>
					</div>
					<p>
						Головним завданням навчально-виховного процесу Школи мистецтв «АРТ ВІВА» є
						створення безпечних умов для творчого, інтелектуального, духовного і
						фізичного самовираження особистості, пошук, розвиток та підтримка обдарованих
						і талановитих дітей. Все це ми робимо з любов&apos;ю, щирістю та відкритою душею.
					</p>
				</Col>
				<Col xs={12} className={styles.mainTextItem}>
					<div className={styles.animIconContainer}>
						<ScrollAnimation animateIn="fadeIn">
							<Enrollment />
						</ScrollAnimation>
					</div>
					<p>
						Ви можете оплатити або заповнити та надіслати заявку на
						навчання за допомогою нашої зручної форми ;)
					</p>
				</Col>
				<Col xs={12} className={styles.mainTextItem}>
					<div className={styles.ctaContainer}>
						<ButtonLink
							variant="primary"
							route="/apply"
							label="Подати заяву"
							className="primary-color-shadow mx-3 my-3 my-md-0 max-width-btn"
						/>
						<ButtonLink
							variant="success"
							route="/pay/form"
							label="Оплатити"
							className="success-color-shadow mx-3 my-3 my-md-0 max-width-btn"
						/>
					</div>
				</Col>
			</Row>
		</Container>
	)
}

export default TextIntro
