import React from 'react'
import { Helmet } from 'react-helmet'
import ScrollAnimation from 'react-animate-on-scroll'

import Carousel from '../../common/MainViewCarousel'
import TextIntro from '../../mainPage/TextIntro'
import Parallax from '../../common/layout/Parallax'
import FeaturedNews from '../../news/FeaturedNews'
import SendContactMessage from '../../contactMessage/SendContactMessage'

import styles from './MainPage.module.sass'

const MainPage = () => {

	return <>
		<Helmet>
			<title>
				Головна сторінка - Школа мистецтв «АРТ ВІВА»
			</title>
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
		<TextIntro />
		<section className={styles.parallax}>
			<Parallax imgSrc="img/parallax/vinyl.webp" />
		</section>
		<FeaturedNews />
		<ScrollAnimation
			animatePreScroll={false}
			animateOnce={true}
			animateIn="fadeInUp"
			delay={250}
		>
			<SendContactMessage />
		</ScrollAnimation>
	</>
}

export default MainPage
