import React from 'react'

import { Col, Form } from 'react-bootstrap'
import SortControlColumn from './SortControlColumn'

const AgeFilter = ({ filter }) => {

	return <SortControlColumn>
		<Col xs={12} md={5} className="d-flex justify-content-center align-items-center">
			<Form.Label className="m-0" htmlFor="age-from">
				Вік років:
			</Form.Label>
		</Col>

		<Col xs={6} md={3}>
			<Form.Control
				id="age-from"
				onChange={event => filter(event)}
				autoComplete="off"
				name="ageFrom"
				size="sm"
				type="number"
				placeholder="від"
				defaultValue="18"
			/>
		</Col>

		<Col xs={6} md={3}>
			<Form.Label htmlFor="age-to" srOnly>до</Form.Label>
			<Form.Control
				id="age-to"
				onChange={event => filter(event)}
				autoComplete="off"
				name="ageTo"
				size="sm"
				type="number"
				placeholder="до"
				defaultValue="75"
			/>
		</Col>
	</SortControlColumn>
}

export default AgeFilter
