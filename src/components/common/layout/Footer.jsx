import React from 'react'
import { footerDate } from '../../../services/dateAndTime'

import { Container, Row, Col } from 'react-bootstrap'
import { ReCaptchaStatement } from '..'

import { ReactComponent as FbIcon } from '../../../svg/facebook.svg'
import { ReactComponent as YouTubeIcon } from '../../../svg/youtube.svg'
import { ReactComponent as MasterCardIcon } from '../../../svg/MasterCard_Logo.svg'
import { ReactComponent as VisaIcon } from '../../../svg/visa-logo.svg'
import { ReactComponent as LiqPayLogoIcon } from '../../../svg/logo-liqpay-main.svg'

import styles from './Footer.module.sass'

const Footer = () => {
	const socialIconsStyle = {
		width: '2em',
	}

	const paymentIconsStyle = {
		maxWidth: '2.3em',
	}

	const LiqPayLogoStyle = {
		maxWidth: '6em',
	}

	// don't show footer inside certain routes
	const path = /\/(school+)/
	if (window.location.pathname.match(path)) return null

	return <footer className={styles.footer}>
		<Container>
			<div className={styles.contactsContainer}>

				<div className={styles.schoolTitle}>
					<p>
						<strong>
							КЗСМО «Школа мистецтв «АРТ ВІВА»
						</strong>
					</p>
					<p>

							Дмитрівської сільської ради<br />
							Бучанського району Київської області
					</p>
				</div>

				<div className={styles.schoolContacts}>
					<p>
						<strong>
							Адреса адміністрації школи:
						</strong>
					</p>
					<p>
							08122, Україна, Київська обл.,<br />
							Києво-Святошинський р-н, село Шпитьки,<br />
							вул. Господарська, будинок 3.
					</p>
				</div>

			</div>

			<Row>
				<Col className={styles.legalLinks}>
					<a href="/privacypolicy"><u>Політика конфіденційності</u></a>
					<a href="/oferta" ><u>Публічна оферта</u></a>
				</Col>
				<Col xs={12} >
					<p className={styles.footerSmallText}>
						Іконки <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
						{' '}з <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
					</p>
					<p className={styles.footerSmallText}>
						Розробка та підтримка сайту <a href="https://jsmonkey.netlify.app/" title="jsMonkey">jsmonkey.netlify.app</a>
					</p>
					<ReCaptchaStatement />
					<Row>
						<Col xs={12} md={8} className={styles.paymentIconsCont}>
							<VisaIcon style={paymentIconsStyle} />
							<MasterCardIcon style={paymentIconsStyle} />
							<LiqPayLogoIcon style={LiqPayLogoStyle} />
						</Col>
						<Col xs={12} md={4} className={styles.socialIconsCont}>
							<a
								href="https://www.facebook.com/myz.shpytky"
								alt="Фейсбук-група КЗСМО «Школа мистецтв «АРТ ВІВА»"
								aria-label="Фейсбук" target="_blank" rel="noopener noreferrer"
							>
								<FbIcon style={socialIconsStyle} />
							</a>
							<a
								href="https://www.youtube.com/@ArtViva"
								alt="Ютюб КЗСМО «Школа мистецтв «АРТ ВІВА»"
								aria-label="Інстаграм" target="_blank" rel="noopener noreferrer"
							>
								<YouTubeIcon style={socialIconsStyle} />
							</a>
						</Col>
					</Row>
				</Col>

				<Col className="text-center text-md-right text-muted">
					<span>
						&copy;&nbsp;{footerDate()} Школа мистецтв «АРТ ВІВА»
					</span>
				</Col>
			</Row>
		</Container>
	</footer>
}

export default Footer
