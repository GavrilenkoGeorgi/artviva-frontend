import React from 'react'

import { Container, Row } from 'react-bootstrap'

const CommonLayout = props => {
	return <Container
		id="layout"
		className="py-4 py-lg-5 animated fadeIn d-flex justify-content-center border1 border-success"
	>
		<Row id="layoutRow" className="justify-content-center">
			{props.children}
		</Row>
	</Container>
}

export default CommonLayout
