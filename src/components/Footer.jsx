import React from 'react'
import { footerDate } from '../services/dateAndTime'

import { Container, Row, Col } from 'react-bootstrap'
import { ReCaptchaStatement } from './common'

import { ReactComponent as FbIcon } from '../svg/facebook.svg'
import { ReactComponent as InstIcon } from '../svg/instagram.svg'
import { ReactComponent as MasterCardIcon } from '../svg/MasterCard_Logo.svg'
import { ReactComponent as VisaIcon } from '../svg/visa-logo.svg'

const Footer = () => {
	const socialIconsStyle = {
		maxWidth: '1.4em',
		margin: '0em .5em'
	}

	const paymentIconsStyle = {
		maxWidth: '2.3em',
		margin: '0rem .5rem'
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
								<p className="mb-2">+38 (050) 963-54-38</p>
								<p className="mb-2">КПНЗ Шпитьківська ДШМ</p>
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
							<Col>
								<VisaIcon style={paymentIconsStyle} />
								<MasterCardIcon style={paymentIconsStyle} />
							</Col>
							<Col className="text-right">
								<a
									href="https://www.facebook.com/myz.shpytky"
									alt="Фейсбук-група Шпитьківської Дитячої Школи Мистецтв"
									aria-label="Фейсбук" target="_blank" rel="noopener noreferrer"
								>
									<FbIcon style={socialIconsStyle} />
								</a>
								<a
									href="https://www.instagram.com/myz_shputky"
									alt="Інстаграм Шпитьківської Дитячої Школи Мистецтв"
									aria-label="Інстаграм" target="_blank" rel="noopener noreferrer"
								>
									<InstIcon style={socialIconsStyle} />
								</a>
							</Col>
						</Row>
					</Col>

					<Col xs={12} className="pt-3 text-center text-muted">
						<span>
							&copy;&nbsp;{footerDate()} Дитяча школа мистецтв ArtViva
						</span>
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
