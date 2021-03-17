import React from 'react'
import { footerDate } from '../../../services/dateAndTime'

import { Container, Row, Col } from 'react-bootstrap'
import { ReCaptchaStatement } from '../../common'

import { ReactComponent as FbIcon } from '../../../svg/facebook.svg'
import { ReactComponent as InstIcon } from '../../../svg/instagram.svg'
import { ReactComponent as MasterCardIcon } from '../../../svg/MasterCard_Logo.svg'
import { ReactComponent as VisaIcon } from '../../../svg/visa-logo.svg'
import { ReactComponent as LiqPayLogoIcon } from '../../../svg/logo-liqpay-main.svg'

const Footer = () => {
	const socialIconsStyle = {
		width: '2em',
		margin: '0em .5em'
	}

	const paymentIconsStyle = {
		maxWidth: '2.3em',
		margin: '1rem 0rem'
	}

	const LiqPayLogoStyle = {
		maxWidth: '6em',
		margin: '1rem'
	}

	// don't show footer inside certain routes
	const path = /\/(school+)/
	if (window.location.pathname.match(path)) return null

	return <footer className="footer pt-lg-5">
		<Container>
			<Row className="mb-3">
				<Col>
					<p className="mb-2 lead">
						<strong>КЗСМО «Школа мистецтв «АРТ ВІВА»</strong>
					</p>
					<p>
						<em>Дмитрівської сільської ради Бучанського району Київської області</em>
					</p>
				</Col>
				<Col xs={12} md={6} className="d-flex align-items-center pt-3 pt-sm-0">
					<Row>
						<Col xs={12} className="pb-2">
							<p className="lead mb-2">
								<strong>Адреса адміністрації школи:</strong>
							</p>
							<p>
								<em className="text-muted">
									08122, Україна, Київська обл.,<br />
									Києво-Святошинський р-н, село Шпитьки,<br />
									вул. Господарська, будинок 3.
								</em>
							</p>
						</Col>
					</Row>
				</Col>
			</Row>

			<Row>
				<Col>
					<a className="mr-3" href="/privacypolicy"><u>Політика конфіденційності</u></a>
					<a href="/oferta" ><u>Публічна оферта</u></a>
				</Col>
				<Col xs={12}>
					<small>
						Іконки <a href="https://www.flaticon.com/authors/freepik" title="Freepik"> Freepik</a>
						{' '}з <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com
						</a>
					</small>
					<ReCaptchaStatement />
					<Row className="justify-content-center mt-2">
						<Col xs={8}>
							<VisaIcon style={paymentIconsStyle} />
							<MasterCardIcon style={paymentIconsStyle} />
							<LiqPayLogoIcon style={LiqPayLogoStyle} />
						</Col>
						<Col xs={4} className="d-flex align-items-center justify-content-end">
							<a
								href="https://www.facebook.com/myz.shpytky"
								alt="Фейсбук-група КЗСМО «Школа мистецтв «АРТ ВІВА»"
								aria-label="Фейсбук" target="_blank" rel="noopener noreferrer"
							>
								<FbIcon style={socialIconsStyle} />
							</a>
							<a
								href="https://www.instagram.com/myz_shputky"
								alt="Інстаграм КЗСМО «Школа мистецтв «АРТ ВІВА»"
								aria-label="Інстаграм" target="_blank" rel="noopener noreferrer"
							>
								<InstIcon style={socialIconsStyle} />
							</a>
						</Col>
					</Row>
				</Col>

				<Col className="pt-3 text-center text-muted">
					<span>
						&copy;&nbsp;{footerDate()} Школа мистецтв «АРТ ВІВА»
					</span>
				</Col>
			</Row>
		</Container>
	</footer>
}

export default Footer
