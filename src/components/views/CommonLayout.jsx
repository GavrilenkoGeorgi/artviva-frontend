import React from 'react'

import { Container, Col } from 'react-bootstrap'

const CommonLayout = props => {
	return <Container className="px-0 animated fadeIn border1 border-danger d-flex justify-content-center">
		<Col lg={8} className="px-0 py-3 border1 border-success">
			{props.children}
		</Col>
	</Container>
}

export default CommonLayout
