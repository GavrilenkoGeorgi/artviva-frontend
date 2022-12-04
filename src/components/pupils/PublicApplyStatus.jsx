import React from 'react'

import { Container, Row, Col } from 'react-bootstrap'
import CommonLayout from '../CommonLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons'

const PublicApplyStatus = ({ status }) => {
	status = 'false'
	return <CommonLayout>
		<Container className='my-5 py-5'>
			<Row className="mt-5 justify-content-center">
				{status === 'success'
					? <Col className="text-center">
						<FontAwesomeIcon icon={faCheck} className="fa-lg success-status-icon"/>
						<h3 className="my-5 text-success text-center custom-font">
							Ваша заявка була прийнята, дякуємо вам!
						</h3>
						<p className='lead'>Поки ви очікуєте відповіді, ви можете дізнатися
						більше <a href='/about'>про нашу школу</a> або <a href='/teachers'>познайомитися з нашими викладачами</a>.
						</p>
					</Col>
					: <Col className="text-center">
						<FontAwesomeIcon icon={faExclamation} className="fa-lg text-warning warning-status-icon"/>
						<p className="mt-3 p-3 text-warning custom-font">
							Щось пішло не так, вибачте за незручності,
							спробуйте знову пізніше або надішліть лист на адресу
							{/* eslint-disable-next-line */}
							<a href={`mailto:admin@artviva.school?subject=Подача%20заяви&body=Не вдалось подати заяву, статус: ${status}`}>
								&nbsp;admin@artviva.school
							</a>
						</p>
					</Col>
				}
			</Row>
		</Container>
	</CommonLayout>
}

export default PublicApplyStatus
