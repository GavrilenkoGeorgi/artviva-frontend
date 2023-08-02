import React from 'react'

import styles from './layout/Footer.module.sass'

const ReCaptchaStatement = () => {
	return (
		<p className={styles.footerSmallText}>
			Цей сайт захищений reCAPTCHA, і застосовуються
			{' '}<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
				Політика конфіденційності
			</a>
			{' '}Google та
			{' '}<a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
				Умови використання.
			</a>
		</p>
	)
}

const MemodReCaptchaStatement = React.memo(ReCaptchaStatement)

export default MemodReCaptchaStatement
