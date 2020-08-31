import React, { useState } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

import { Col } from 'react-bootstrap'
import RecoverForm from '../forms/RecoverForm'
import CommonLayout from './CommonLayout'


const RecoverView = () => {

	const [emailSent, setEmailSent] = useState(false)

	return <CommonLayout>
		<Col xs={12} className="mt-4 mb-5 text-center">
			{emailSent
				? <>
					<FontAwesomeIcon icon={faEnvelope} className="fa-lg success-status-icon"/>
					<h4 className="text-success text-center mt-3">
						На вашу електронну адресу надіслано лист з інструкціями щодо відновлення пароля
					</h4>
				</>
				: <>
					<h3 className="text-center custom-font">
						Надіслати скидання пароля
					</h3>
					<p className="mb-4 text-muted text-center">
						<em>
							Введіть електронну адресу, яку ви використовували для реєстрації
						</em>
					</p>
					<RecoverForm setEmailSent={setEmailSent} />
				</>
			}
		</Col>
	</CommonLayout>
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(RecoverView)
