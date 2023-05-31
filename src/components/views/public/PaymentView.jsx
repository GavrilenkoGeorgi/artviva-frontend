import React from 'react'
import { Helmet } from 'react-helmet'

import { Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'

import PaymentForm from '../../forms/PaymentForm'
import CommonLayout from '../../CommonLayout'
import FormLayout from '../../common/layout/FormLayout'

const PaymentView = ({ match }) => {
	const { status } = { ...match.params }

	let content = <Col className="text-center py-4">
		<h1 className="font-weight-lighter">
			Статус вашого платіжу
		</h1>
		<em className="display-4">{status}</em>
	</Col>

	switch (status) {
	case 'form':
		content = <FormLayout>
			<h1 className="text-center custom-font pb-4">
				Оплата навчання
			</h1>
			<PaymentForm />
		</FormLayout>
		break
	case 'success':
		content = <Col className="text-center py-4">
			<FontAwesomeIcon
				icon={faReceipt}
				className="fa-lg payment-status-icon"
			/>
			<h1 className="text-success font-weight-light pt-4">
				Дякуємо, ваш платіж обробляється
			</h1>
		</Col>
		break
	default:
		break
	}

	return <>
		<Helmet>
			<title>Оплата навчання</title>
			<meta name="description" content="Сплачуйте вартість навчання безпосередньо на сайті"/>
		</Helmet>
		<CommonLayout>
			{content}
		</CommonLayout>
	</>
}

export default PaymentView
