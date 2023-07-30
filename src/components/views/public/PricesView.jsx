import React from 'react'
import { Helmet } from 'react-helmet'

import { Tabs, Tab } from 'react-bootstrap'
import CommonLayout from '../../CommonLayout'
import { Prices, Benefits, Conditions } from '../../prices'

import styles from './PricesView.module.sass'

const PricesView = () => {

	return <>
		<Helmet>
			<title>Ціни на навчання</title>
			<meta name="description" content="Актуальні ціни на навчання в школі мистецтв." />
		</Helmet>
		<CommonLayout>
			<h1 className="text-center">
				Інформація про освітні послуги
			</h1>
			<Tabs defaultActiveKey="prices"
				id="prices-tabs"
				aria-label="Вкладки з інформацією про ціни"
			>
				<Tab eventKey="prices" title="Ціни" className={styles.tab}>
					<Prices />
				</Tab>
				<Tab eventKey="benefits" title="Пільги" className={styles.tab}>
					<Benefits />
				</Tab>
				<Tab eventKey="conditions" title="Умови навчання" className={styles.tab}>
					<Conditions />
				</Tab>
			</Tabs>
		</CommonLayout>
	</>
}

export default PricesView
