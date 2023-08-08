import React, { useState } from 'react'

import QuestionnaireCTA from './QuestionnaireCTA'
import CloseBtnSVG from '../common/buttons/CloseBtnSVG'
import styles from './Banner.module.sass'
import { useEffect } from 'react'

const Banner = () => {

	const [ visible, setVisible ] = useState(true)

	useEffect(() => {
		if (window.sessionStorage.getItem('closedBanner')) {
			setVisible(false)
		}
	}, [])

	const handleClick = () => {
		window.sessionStorage.setItem('closedBanner', true)
		setVisible(false)
	}

	return visible && <div className={styles.bannerLayout}>
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
