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
		margin: '0em .5em'
	}

	return (
		<footer className="footer">
			<Container>
				<Row className="pt-4 pt-md-5 border1 border-success">
					<Col className="text-center d-flex align-items-center">
						<div style={{ width: '100%' }}>
							<VisaIcon style={paymentIconsStyle} />
							<MasterCardIcon style={paymentIconsStyle} />
						</div>
					</Col>

					<Col className="icons-column text-center">
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

				<Row className="py-2 pt-lg-3">
					<Col xs={12} md={6} className="py-1 d-flex align-items-center">
						<Row className="text-muted">
							<Col xs={12}>
								<strong>
									&copy;&nbsp;{footerDate()} Дитяча школа мистецтв ArtViva.
								</strong>
							</Col>
							<Col>
								<small>
									{/* eslint-disable-next-line */}
									Іконки <a href="https://www.flaticon.com/authors/freepik" title="Freepik"> Freepik</a> з <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com
									</a>
								</small>
							</Col>
						</Row>
					</Col>
					<Col xs={12} md={6} className="py-1">
						<ReCaptchaStatement />
					</Col>
				</Row>
			</Container>
		</footer>
	)
}

export default Footer
