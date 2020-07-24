import React from 'react'
import { nestedSort } from '../../utils/arrayHelpers'

import { Form } from 'react-bootstrap'

const SortData = ({ sortBy, data, setData }) => {

	const changeOrder = ({ id: field, checked }) => {
		const sortOptions = {
			field,
			sortOrder: checked ? 'asc' : 'desc'
		}
		const result = data.sort(nestedSort(sortOptions.field, null, sortOptions.sortOrder))
		setData([ ...result ])
	}

	return (
		<>
			{sortBy.map(item =>
				<Form.Check
					key={item.fieldName}
					custom
					inline
					type="checkbox"
					id={item.fieldName}
					label={item.label}
					onChange={event => changeOrder(event.target)}
				/>
			)}
		</>
	)
}

export default SortData
