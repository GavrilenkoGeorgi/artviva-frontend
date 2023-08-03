import React from 'react'
import { ParallaxProvider, ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax'

import styles from './Parallax.module.sass'

const Parallax = ({ imgSrc, aspect }) => {
	return <section className={styles.parallaxSection}>
		<ParallaxProvider>
			<ParallaxBanner style={{ aspectRatio: aspect }}>
				<ParallaxBannerLayer image={imgSrc} speed={-20} />
			</ParallaxBanner>
		</ParallaxProvider>
	</section>
}

export default Parallax
