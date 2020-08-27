import React from 'react'

import { Container, Row} from 'react-bootstrap'
import { CommonLayout } from '../views'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons'

const PublicApplyStatus = ({ status }) => {
	return <CommonLayout>
		<Container>
			<Row className="mt-5 justify-content-center">
				{status === 'success'
					? <>
						<FontAwesomeIcon icon={faCheck} className="fa-lg success-status-icon"/>
						<h3 className="my-5 text-success text-center custom-font">
							Ваша заявка була прийнята, дякуємо вам!
						</h3>
					</>
					: <>
						<FontAwesomeIcon icon={faExclamation} className="fa-lg text-warning warning-status-icon"/>
						<p className="mt-3 p-3">
							Щось пішло не так, вибачте за незручності,
							спробуйте знову пізніше або надішліть лист на адресу
							{/* eslint-disable-next-line */}
							<a href={`mailto:admin@artviva.school?subject=Подача%20заяви&body=Не вдалось подати заяву, статус: ${status}`}>
								&nbsp;admin@artviva.school
							</a>
						</p>
					</>
				}
			</Row>
		</Container>
	</CommonLayout>
}

export default PublicApplyStatus
