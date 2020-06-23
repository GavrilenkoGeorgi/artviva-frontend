import React from 'react'
import { footerDate } from '../services/dateAndTime'
import { Container, Row, Col } from 'react-bootstrap'

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
				<Row>
					<Col xs={5} className="d-flex align-items-center">
						<span className="text-muted copy-info">
							<strong>
								&copy;&nbsp;{footerDate()}&nbsp;ArtViva
							</strong>
							<br />
							<small>
								Іконки <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
									Freepik</a> з <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com
								</a>
							</small>
						</span>
					</Col>

					<Col xs={4} className="text-center px-0 d-flex align-items-center">
						<div style={{ width: '100%' }}>
							<VisaIcon style={paymentIconsStyle} />
							<MasterCardIcon style={paymentIconsStyle} />
						</div>
					</Col>

					<Col xs={3} className="icons-column text-center px-0">
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
			</Container>
		</footer>
	)
}

export default Footer
