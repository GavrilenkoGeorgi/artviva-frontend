import React from 'react'

import { Col, Tabs, Tab } from 'react-bootstrap'
import CommonLayout from '../../CommonLayout'
import { Prices, Benefits, Conditions } from '../../prices'

const PricesView = () => {

	return <CommonLayout>
		<h1 className="text-center custom-font">Інформація про освітні послуги</h1>
		<Tabs defaultActiveKey="prices" id="prices-tabs" className="text-center">
			<Tab eventKey="prices" title="Ціни">
				<Col className="pt-4">
					<Prices />
				</Col>
			</Tab>
			<Tab eventKey="benefits" title="Пільги">
				<Col className="pt-4">
					<Benefits />
				</Col>
			</Tab>
			<Tab eventKey="conditions" title="Умови навчання">
				<Col className="pt-4">
					<Conditions />
				</Col>
			</Tab>
		</Tabs>
	</CommonLayout>
}

export default PricesView