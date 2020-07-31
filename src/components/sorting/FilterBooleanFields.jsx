import React from 'react'

import { Form, Row } from 'react-bootstrap'
import SortControlColumn from './SortControlColumn'

const FilterBooleanFields = ({ filter, selectBy }) => {
	return <Form.Group as={Row}>
		{selectBy.map(item =>
			<SortControlColumn key={item.field} className="py-1">
				<Form.Label className="m-0" srOnly>
					<small>{item.label}</small>
				</Form.Label>
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
			</SortControlColumn>
		)}
	</Form.Group>
}

export default FilterBooleanFields
