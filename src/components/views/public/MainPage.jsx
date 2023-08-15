import React from 'react'
import { connect } from 'react-redux'

import { Helmet } from 'react-helmet'
import ScrollAnimation from 'react-animate-on-scroll'

import { Container, Row, Col, Image } from 'react-bootstrap'
import Carousel from '../../common/MainViewCarousel'
import SendContactMessage from '../../contactMessage/SendContactMessage'
import ButtonLink from '../../common/buttons/ButtonLink'
import { ReactComponent as OrigamiIcon } from '../../../svg/origami.svg'
import { ReactComponent as EditIcon } from '../../../svg/edit.svg'
import { ReactComponent as LoveSongIcon } from '../../../svg/love-song.svg'
import { ReactComponent as Enrollment } from '../../../svg/enrollment.svg'
import styles from './MainPage.module.sass'
/* import Announcement from '../../announcements/Announcement' */
import Parallax from '../../common/layout/Parallax'

const MainPage = () => {
	return (
		<>
			<Helmet>
				<title>Школа мистецтв «АРТ ВІВА» - Головна сторінка</title>
				<meta
					name="description"
					content="Школа мистецтв «АРТ ВІВА» сучасний заклад початкової мистецької освіти."
				/>
				<meta
					name="keywords"
					content="музична, художня, мистецька, освіта, школа, мистецтв, арт, віва, artviva"
				/>
			</Helmet>
			<Carousel />
			<div className={styles.logoImg}>
				<Image
					src="img/logo/artviva_logo.png"
					className='responsive-image'
					alt="Лого ArtViva"
				/>
			</div>
			<Container>
				<Row>
					{/* <Announcement /> */}
					<Col>
						<Row className="text-center justify-content-center">
							<Col sm={6} className={styles.mainTextItem}>
								<ScrollAnimation animateIn="fadeIn">
									<OrigamiIcon />
								</ScrollAnimation>
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
								<ScrollAnimation animateIn="fadeIn">
									<EditIcon />
								</ScrollAnimation>
								<p>
									Дирекція школи у цей складний час, прикладає
									максимум зусиль для того, щоб діти почували
									себе комфортно та в безпеці, та працює над
									покращенням матеріальної бази, впровадження
									новітніх технологій та підняття якості
									навчання відповідно до нових освітніх програм.
								</p>
							</Col>
							<Col sm={8} className={styles.mainTextItem}>
								<ScrollAnimation animateIn="fadeIn">
									<LoveSongIcon />
								</ScrollAnimation>
								<p>
									Головним завданням навчально-виховного процесу Школи мистецтв «АРТ ВІВА» є
									створення безпечних умов для творчого, інтелектуального, духовного і
									фізичного самовираження особистості, пошук, розвиток та підтримка обдарованих
									і талановитих дітей. Все це ми робимо з любов&apos;ю, щирістю та відкритою душею.
								</p>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
			<Container>
				<Row className="d-flex justify-content-center">
					<Col sm={8} className={styles.mainTextItem}>
						<ScrollAnimation animateIn="fadeIn">
							<Enrollment />
						</ScrollAnimation>
						<p>
							Ви можете оплатити або заповнити та надіслати заявку на
							навчання за допомогою нашої зручної форми ;)
						</p>
					</Col>
					<Col xs={12} className={styles.mainTextItem}>
						<div>
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
			<div className={styles.parallax}>
				<Parallax imgSrc="img/parallax/vinyl.webp" aspect="2 / 1" />
			</div>
			<SendContactMessage />
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(MainPage)
