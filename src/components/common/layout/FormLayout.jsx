import React from 'react'

import { Col } from 'react-bootstrap'
import styles from './FormLayout.module.sass'

const FormLayout = ({ children }) => {
	return <Col md={9} lg={6} className={styles.formLayout}>
		{children}
	</Col>
}

export default FormLayout
