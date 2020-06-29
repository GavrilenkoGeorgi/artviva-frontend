import React from 'react'

const ReCaptchaStatement = () => {
	return (
		<div className="recaptcha-statement">
			Цей сайт захищений reCAPTCHA, і застосовуються
			<a href="https://policies.google.com/privacy">
				Політика конфіденційності
			</a>
			Google та
			<a href="https://policies.google.com/terms">
				Умови використання.
			</a>
		</div>
	)
}

const MemodReCaptchaStatement = React.memo(ReCaptchaStatement)

export default MemodReCaptchaStatement
