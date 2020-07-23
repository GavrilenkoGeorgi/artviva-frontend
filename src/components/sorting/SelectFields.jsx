import React from 'react'

import { Form, Row, Col } from 'react-bootstrap'

const SelectFields = ({ filter, selectBy }) => {

	return (
		<>
			<Form.Group as={Row} className="mb-0">
				{selectBy.map(item =>
					<Col xs={6} key={item.field}>
						<Form.Control
							size="sm"
							as="select"
							custom
							className="my-2"
							id={item.field}
							name={item.field}
							onInput={event => filter(event)}>
							<option value="">
								{item.label}
							</option>
							{item.choices.map(choice =>
								<option value={choice} key={item.field + choice}>
									{choice}
								</option>)}
						</Form.Control>
					</Col>
				)}
			</Form.Group>
		</>
	)
}

export default SelectFields
