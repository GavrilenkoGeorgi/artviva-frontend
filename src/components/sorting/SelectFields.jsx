import React from 'react'

import { Form, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react'

const SelectFields = ({ clear, filter, selectBy }) => {

	useEffect(() => {
		console.log('Clear')
	}, [clear])


	return (
		<>
			<Form.Group as={Row} className="mb-0">
				{selectBy.map(item =>
					<Col xs={6} key={item.field}>
						<Form.Label className="m-0">
							<small>{item.label}</small>
						</Form.Label>
						<Form.Control
							size="sm"
							as="select"
							custom
							className="mt-1 mb-3 filter-select"
							id={item.field}
							name={item.field}
							onInput={event => filter(event)}
						>
							<option value=""
								className="filter-select-option">
								Всі наявні
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
