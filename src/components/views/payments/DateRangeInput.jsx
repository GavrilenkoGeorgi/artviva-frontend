import React from 'react'

import CommonLayout from '../CommonLayout'
import { Container, Row, Col } from 'react-bootstrap'

const DateRangeInput1 = (props) => {

	console.log('Date range', props)

	return <CommonLayout>
		<Container>
			<Row>
				<Col>
					<h1>LiqPay</h1>
				</Col>
			</Row>
		</Container>
	</CommonLayout>
}

export default DateRangeInput1
