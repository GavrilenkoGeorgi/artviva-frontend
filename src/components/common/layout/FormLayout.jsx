import React from 'react'

import { Col } from 'react-bootstrap'

const FormLayout = ({ children }) => {
	return <Col lg={7}>
		{children}
	</Col>
}

export default FormLayout
