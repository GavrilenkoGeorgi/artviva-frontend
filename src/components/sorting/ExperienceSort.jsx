import React from 'react'
import PropTypes from 'prop-types'
import 'moment-precise-range-plugin'

import { Col, Form } from 'react-bootstrap'

const ExperienceSort = ({ filter }) => {
	return (
		<Form className="my-2 d-flex align-content-center align-items-center justify-content-between">
			<Col xs="4" className="px-0 text-right">
				<Form.Label className="m-0" htmlFor="xp-from">Стаж років:</Form.Label>
			</Col>
			<Col xs="2" className="px-0">
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

			<Col xs="2" className="px-0">
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
		</Form>
	)
}

ExperienceSort.propTypes = {
	filter: PropTypes.func.isRequired
}

export default ExperienceSort
