import React from 'react'
import { connect } from 'react-redux'

import { ParallaxProvider } from 'react-scroll-parallax'
import { ParallaxBanner } from 'react-scroll-parallax'
import ParallaxCache from './common/ParallaxCache'
import ScrollAnimation from 'react-animate-on-scroll'

import { Container, Row, Col, Image } from 'react-bootstrap'
import Carousel from './common/MainViewCarousel'
import ContactForm from './forms/ContactForm'
import ButtonLink from './common/buttons/ButtonLink'
import { ReactComponent as OrigamiIcon } from '../svg/origami.svg'
import { ReactComponent as EditIcon } from '../svg/edit.svg'
import { ReactComponent as LoveSongIcon } from '../svg/love-song.svg'
import { ReactComponent as Enrollment } from '../svg/enrollment.svg'

const MainPage = () => {
	return (
		<>
			<Carousel />
			<Container>
				<Row className="pt-4">
					<Col
						xs={4}
						className="d-flex justify-content-center align-items-center"
					>
						<Image
							src="img/schoolLogo-transparent.png"
							className='responsive-image'
							alt="Лого ArtViva"
						/>
					</Col>
					<Col
						xs={8}
						className="d-flex justify-content-center align-items-center"
					>
						<strong className="main-title custom-font">
							ArtViva — дитяча школа мистецтв.
						</strong>
					</Col>
					<Col>
						<Row className="text-center pt-4 justify-content-center">
							<Col xs={12} sm={6} className="py-4">
								<ScrollAnimation animateIn="fadeIn">
									<OrigamiIcon />
								</ScrollAnimation>
								<p className="pt-4 px-2 main-page-descr">
									Сьогодні Шпитьківська ДШМ на чолі з Іванчук Оленою Анатоліївною
									&mdash; сучасний заклад естетичного виховання, де на музичному,
									хореографічному та художньому відділеннях 80 досвідчених, дипломованих
									викладачів та концертмейстерів навчають майже 1000 дітей.
								</p>
							</Col>
							<Col xs={12} sm={6} className="py-4">
								<ScrollAnimation animateIn="fadeIn">
									<EditIcon />
								</ScrollAnimation>
								<p className="pt-4 px-2 main-page-descr">
									Адміністрація школи прикладає максимум зусиль для покращення
									і осучаснення матеріальної бази, впровадження новітніх технологій
									та підняття якості навчання на новий рівень.
								</p>
							</Col>
							<Col xs={12} sm={10} className="py-4">
								<ScrollAnimation animateIn="fadeIn">
									<LoveSongIcon />
								</ScrollAnimation>
								<p className="pt-4 px-2 main-page-descr">
									Головним завданням навчально-виховного процесу ШДШМ є створення умов
									для творчого, інтелектуального, духовного і фізичного самовираження
									особистості, пошук, розвиток та підтримка обдарованих і талановитих
									дітей. Все це ми робимо з любов&apos;ю, щирістю та відкритою душею.
								</p>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
			<Container className="border1 border-primary">
				<Row className="border1 border-success d-flex justify-content-center">
					<Col sm={10} className="py-4 text-center">
						<ScrollAnimation animateIn="fadeIn">
							<Enrollment />
						</ScrollAnimation>
						<p className="pt-4 px-2 main-page-descr">
							Ви можете оплатити або заповнити та надіслати заявку на
							навчання за допомогою нашої зручної форми ;)
						</p>
						<p className="py-4 text-center">
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
						</p>
					</Col>
				</Row>
			</Container>
			<ParallaxProvider>
				<ParallaxCache />
				<ParallaxBanner
					className="parallax-main-page"
					layers={[
						{
							image: 'img/parallax/book-crop.jpg',
							amount: 0.3,
						},
					]}
					style={{
						height: '30rem',
					}}
				>
				</ParallaxBanner>
			</ParallaxProvider>
			<Container>
				<ContactForm />
			</Container>
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
