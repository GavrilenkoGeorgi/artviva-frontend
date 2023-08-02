import React from 'react'

import { Container, Row } from 'react-bootstrap'

const CommonLayout = props => {
	return <Container
		id="layout"
		className="mt-5 animated fadeIn"
	>
		<Row id="layoutRow"
			className="d-flex flex-column align-items-center align-content-center"
		>
			{props.children}
		</Row>
	</Container>
}

export default CommonLayout
