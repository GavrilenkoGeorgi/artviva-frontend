import React from 'react'
import { Carousel } from 'react-bootstrap'

import styles from './MainViewCarousel.module.sass'

const MainViewCarousel = () => {
	return (
		<Carousel className={styles.carouselContainer} interval={20000}>
			<Carousel.Item>
				<div className={styles.carouselOverlay}></div>
				<img
					className="d-block w-100"
					src="img/carousel/arts-n-crafts.jpg"
					alt="First slide"
				/>
				<Carousel.Caption className={styles.caption}>
					<h3 className={styles.slideTitle}>Напрямки</h3>
					<p>Образотворче мистецтво, музика, театр</p>
				</Carousel.Caption>
			</Carousel.Item>

			<Carousel.Item>
				<div className={styles.carouselOverlay}></div>
				<img
					className="d-block w-100"
					src="img/carousel/paper-boats.jpg"
					alt="Third slide"
				/>
				<Carousel.Caption className={styles.caption}>
					<h3 className={styles.slideTitle}>Вчителі</h3>
					<p>Наші вчителі найдосвідченіші! )</p>
				</Carousel.Caption>
			</Carousel.Item>

			<Carousel.Item>
				<div className={styles.carouselOverlay}></div>
				<img
					className="d-block w-100"
					src="img/carousel/commerce.jpg"
					alt="Third slide"
				/>
				<Carousel.Caption className={styles.caption}>
					<h3 className={styles.slideTitle}>Навчання</h3>
					<p>Заповнити заявку ви можете у нас на сайті</p>
				</Carousel.Caption>
			</Carousel.Item>
		</Carousel>
	)
}

export default MainViewCarousel
