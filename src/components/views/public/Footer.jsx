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
		width: '1.4em',
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

	return (
		<footer className="footer d-flex align-items-center">
			<Container>
				<Row>
					<Col xs={12} md={6} className="py-1 d-flex align-items-center">
						<Row>
							<Col xs={12} className="pb-2">
								<p className="mb-2">КЗСМО «Школа мистецтв «АРТ ВІВА»</p>
								<em className="text-muted">
									08122, Київська обл., Києво-Святошинський район, с. Шпитьки, вул. Господарська, 3
								</em>

							</Col>

							<Col className="py-3 d-flex justify-content-around">
								<a href="/privacypolicy" >Політика конфіденційності</a>
								<a href="/oferta" >Публічна оферта</a>
							</Col>
						</Row>
					</Col>
					<Col xs={12} md={6} className="py-1">
						<small>
							{/* eslint-disable-next-line */}
							Іконки <a href="https://www.flaticon.com/authors/freepik" title="Freepik"> Freepik</a> з <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com
							</a>
						</small>
						<ReCaptchaStatement />
						<Row>
							<Col xs={8} className="pr-0">
								<VisaIcon style={paymentIconsStyle} />
								<MasterCardIcon style={paymentIconsStyle} />
								<LiqPayLogoIcon style={LiqPayLogoStyle} />
							</Col>
							<Col xs={4} className="d-flex align-items-center justify-content-center">
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

					<Col xs={12} className="pt-3 text-center text-muted">
						<span>
							&copy;&nbsp;{footerDate()} Школа мистецтв «АРТ ВІВА»
						</span>
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
