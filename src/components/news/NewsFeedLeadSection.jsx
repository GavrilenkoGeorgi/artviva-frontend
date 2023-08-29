import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'

import styles from './NewsFeedLeadSection.module.sass'

const NewsFeedLeadSection = () => {

	return <div className={styles.introContainer}>
		<div className={styles.socialIconsCont}>
			<a href="https://www.facebook.com/myz.shpytky"
				alt="Фейсбук-група КЗСМО «Школа мистецтв «АРТ ВІВА»"
				aria-label="Фейсбук" target="_blank" rel="noopener noreferrer"
			>
				<FontAwesomeIcon icon={faFacebookF} />
			</a>
			<a
				href="https://www.youtube.com/@ArtViva"
				alt="Ютюб КЗСМО «Школа мистецтв «АРТ ВІВА»"
				aria-label="Інстаграм" target="_blank" rel="noopener noreferrer"
			>
				<FontAwesomeIcon icon={faYoutube} />
			</a>
			<a href="https://www.instagram.com/myz_shputky"
				alt="Інстаграм КЗСМО «Школа мистецтв «АРТ ВІВА»"
				aria-label="Інстаграм" target="_blank" rel="noopener noreferrer"
			>
				<FontAwesomeIcon icon={faInstagram} />
			</a>
		</div>
		<div className={styles.pageIntro}>
			<p>
				Ласкаво просимо до новин,
				де креативність перебуває на першому плані ;)
			</p>
			<p>
				Відкрийте для себе останні події, надихаючі
				історії та визначні досягнення наших талановитих
				учнів: художників та музикантів, артистів та
				хореографів. Досліджуйте дивовижний світ мистецтва,
				музики, театру та знайдіть натхнення для приєднання
				до нашої спільноти учнів.
			</p>
			<p className={styles.slogan}>
				Здійсни свої творчі мрії та розкрий
				свій талант разом з &ldquo;Арт Віва&rdquo;!
			</p>
		</div>
	</div>
}

export default NewsFeedLeadSection
