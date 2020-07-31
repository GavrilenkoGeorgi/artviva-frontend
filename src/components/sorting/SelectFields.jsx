import React from 'react'

import { Form, Row } from 'react-bootstrap'
import SortControlColumn from './SortControlColumn'

const SelectFields = ({ filter, selectBy }) => {
	return <Form.Group as={Row} className="mb-0">
		{selectBy.map(item =>
			<SortControlColumn key={item.field}>
				<Form.Label className="m-0">
					<small>{item.label}</small>
				</Form.Label>
				<Form.Control
					size="sm"
					as="select"
					custom
					className="mb-2 filter-select"
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
			</SortControlColumn>
		)}
	</Form.Group>
}

export default SelectFields
