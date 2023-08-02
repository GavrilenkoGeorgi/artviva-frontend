import React from 'react'

const ReCaptchaStatement = () => {
	return (
		<div className="footer-small-text">
			Цей сайт захищений reCAPTCHA, і застосовуються
			{' '}<a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
				Політика конфіденційності
			</a>
			{' '}Google та
			{' '}<a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
				Умови використання.
			</a>
		</div>
	)
}

const MemodReCaptchaStatement = React.memo(ReCaptchaStatement)

export default MemodReCaptchaStatement
