import React, { useState, useEffect } from 'react'
import { string } from 'prop-types'
import { ParallaxProvider, ParallaxBanner, ParallaxBannerLayer } from 'react-scroll-parallax'
import { useWindowSize } from '../../../hooks'

const Parallax = ({ imgSrc }) => {

	const [ aspect, setAspect ] = useState('4 / 3')
	const screenWidth = useWindowSize().width

	useEffect(() => {
		if (screenWidth >= 500) setAspect('16 / 9')
		if (screenWidth >= 1280) setAspect('16 / 5')
	}, [ screenWidth ])

	return <ParallaxProvider>
		<ParallaxBanner style={{ aspectRatio: aspect }}>
			<ParallaxBannerLayer image={imgSrc} speed={-20} />
		</ParallaxBanner>
	</ParallaxProvider>
}

Parallax.popTypes = {
	imgSrc: string.isRequired
}

export default Parallax
