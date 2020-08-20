import React from 'react'

import { Container, Row, Col } from 'react-bootstrap'

const SortControlColumn = props => {
	return <Col xs={12} sm={6} className="d-flex align-items-end py-2">
		<Container className={props.className}>
			<Row>
				{props.children}
			</Row>
		</Container>
	</Col>
}

export default SortControlColumn
