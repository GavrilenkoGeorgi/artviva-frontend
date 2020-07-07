import React from 'react'

import { Container, Col, Row, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'

const SortingControls = ({ filter, filterBy, sortBy, sort, sortOrder }) => {

	const sortLabel = (label, fieldName) => {
		return (
			<Row>
				<Col>{label}&nbsp;
					{sortOrder[fieldName]
						? <FontAwesomeIcon icon={faAngleDown} className="text-primary"/>
						: <FontAwesomeIcon icon={faAngleUp} />
					}
				</Col>
			</Row>
		)
	}

	return (
		<>
			<Container className="py-2 mb-4 border border-success rounded">
				<Form>
					<em className="text-muted">Фільтр:</em>
					<Form.Row>
						{filterBy.map(item =>
							<Col key={item.fieldName} xs={12} sm={6} className="py-2">
								<Form.Control
									placeholder={item.label}
									id={`${item.fieldName}-filter`}
									name={item.fieldName}
									onChange={event => filter(event)}
								/>
							</Col>
						)}
					</Form.Row>
					<em className="text-muted">
						Сортування:
					</em><br />
					{sortBy.map(item =>
						<Form.Check
							key={item.fieldName}
							custom
							inline
							className="py-1"
							type="checkbox"
							id={item.fieldName}
							label={sortLabel(item.label, item.fieldName)}
							checked={sortOrder[item.fieldName]}
							onChange={event => sort(event.target)}
						/>
					)}
				</Form>
			</Container>
		</>
	)
}

export default SortingControls
