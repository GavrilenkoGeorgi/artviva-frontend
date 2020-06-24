import React, { useState, useEffect } from 'react'
import throttle from '../../utils/throttle'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import Fade from 'react-bootstrap/Fade'

const ScrollToTopArrow = () => {

	const [isVisible, setVisible] = useState(false)

	const toggleVisibility = () => {
		window.pageYOffset > 200 ? setVisible(true) : setVisible(false)
	}

	useEffect(() => {
		window.addEventListener('scroll', throttle(toggleVisibility, 500))
		return () => window.removeEventListener('scroll', toggleVisibility)
	}, [])

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		})
		// this doesn't spark joy
		setTimeout(() => toggleVisibility(), 1500)
	}

	return (
		<>
			<Fade in={isVisible}>
				<button
					className="scroll-to-top"
					onClick={() => scrollToTop()}
				>
					<FontAwesomeIcon icon={faArrowUp} className={'fa-2x'}/>
				</button>
			</Fade>
		</>
	)
}

export default ScrollToTopArrow
