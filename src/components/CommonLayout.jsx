import React from 'react'

import { Container, Row } from 'react-bootstrap'
import styles from './CommonLayout.module.sass'

const CommonLayout = props => {
	return <Container
		id="layout"
		className={`${styles.commonLayout} animated fadeIn`}
	>
		<Row id="layoutRow"
			className="d-flex flex-column align-items-center align-content-center"
		>
			{props.children}
		</Row>
	</Container>
}

export default CommonLayout
