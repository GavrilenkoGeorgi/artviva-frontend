import React from 'react'
import PropTypes from 'prop-types'
import 'moment-precise-range-plugin'

import { Form, Col } from 'react-bootstrap'
import SortControlColumn from './SortControlColumn'

const ExperienceSort = ({ filter }) => {
	return <SortControlColumn>
		<Col xs={12} md={5} className="d-flex justify-content-center align-items-center">
			<Form.Label className="m-0" htmlFor="xp-from">
				Стаж років:
			</Form.Label>
		</Col>

		<Col xs={6} md={3}>
			<Form.Control
				id="xp-from"
				onChange={event => filter(event)}
				autoComplete="off"
				name="from"
				size="sm"
				type="number"
				placeholder="від"
			/>
		</Col>

		<Col xs={6} md={3}>
			<Form.Label htmlFor="xp-to" srOnly>до</Form.Label>
			<Form.Control
				id="xp-to"
				onChange={event => filter(event)}
				autoComplete="off"
				name="to"
				size="sm"
				type="number"
				placeholder="до"
			/>
		</Col>
	</SortControlColumn>
}

ExperienceSort.propTypes = {
	filter: PropTypes.func.isRequired
}

export default ExperienceSort
