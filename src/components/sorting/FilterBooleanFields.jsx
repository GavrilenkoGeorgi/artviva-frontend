import React from 'react'

import { Form, Row, Col } from 'react-bootstrap'

const FilterBooleanFields = ({ filter, selectBy }) => {
	return (
		<>
			<Form.Group as={Row}>
				{selectBy.map(item =>
					<Col xs={6} key={item.field} className="mb-2">
						<Form.Control
							size="sm"
							as="select"
							custom
							id={item.field}
							name={item.field}
							onInput={event => filter(event)}>
							<option value="">
								{item.label}
							</option>
							<option value={false} key={`${item.field}-false`}>
								{item.choices[0]}
							</option>
							<option value={true} key={`${item.field}-true`}>
								{item.choices[1]}
							</option>
						</Form.Control>
					</Col>
				)}
			</Form.Group>
		</>
	)
}

export default FilterBooleanFields
