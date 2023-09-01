import React, { useState, useEffect } from 'react'

import QuestionnaireCTA from './QuestionnaireCTA'
import CloseBtnSVG from '../common/buttons/CloseBtnSVG'
import styles from './Banner.module.sass'

const Banner = () => {

	const [ open, setOpen ] = useState(false)

	// if there is no banner data, show banner
	useEffect(() => {
		if (!window.sessionStorage.getItem('banner')) {
			setTimeout(() => { // animate it
				setOpen(true)
			}, 500)
		}
	}, [])

	const handleClick = () => {
		window.sessionStorage.setItem('banner', 'closed')
		setOpen(false)
	}

	const { bannerLayout, visible, hidden } = styles
	const banner = `${bannerLayout} ${open ? visible : hidden}`
	const path = /\/(school+)/

	if (window.location.pathname.match(path)) return null

	return <div className={banner}>
		<div className={styles.bannerContainer}>
			<div className={styles.closeBtnCont}>
				<button onClick={() => handleClick()}>
					<CloseBtnSVG />
				</button>
			</div>
			<QuestionnaireCTA />
		</div>
	</div>
}

export default Banner
