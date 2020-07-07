import React from 'react'

import { Container, Row, Col } from 'react-bootstrap'

const PublicApplyStatus = ({ status }) => {
	return (
		<Container>
			<Row className="justify-content-center">
				<Col xs={10}>
					{status === 'success'
						? <p>Ваша заявка була прийнята, дякуємо вам.</p>
						: <p>
							Щось пішло не так, вибачте за незручності,
							спробуйте знову пізніше або надішліть лист на адресу
							{/* eslint-disable-next-line */}
							<a href={`mailto:admin@artviva.school?subject=Подача%20заяви&body=Не вдалось подати заяву, статус: ${status}`}>
								&nbsp;admin@artviva.school
							</a>
						</p>
					}
				</Col>
			</Row>
		</Container>
	)
}

export default PublicApplyStatus
