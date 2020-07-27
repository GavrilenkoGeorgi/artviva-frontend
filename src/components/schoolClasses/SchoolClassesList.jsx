import React from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'

import { ListGroup, Row, Col } from 'react-bootstrap'
import SchoolClass from './SchoolClass'

const SchoolClassesList = ({ schoolClasses }) => {

	return (
		<>
			<ListGroup className="py-2">
				{schoolClasses.map(schoolClass =>
					<ListGroup.Item
						key={schoolClass.id}
					>
						<Row>
							<Col xs={12}>
								<SchoolClass schoolClass={schoolClass}/>
							</Col>
							<Col xs={3} className="pl-4">
								<small className="text-muted">
									<em>{schoolClass.pupils.length} учів</em>
								</small>
							</Col>
							<Col xs={9}>
								<div className="text-muted text-right">
									<em>{schoolClass.teacher.name}
									</em>
								</div>
							</Col>
						</Row>
					</ListGroup.Item>
				)}
			</ListGroup>
		</>
	)
}

const mapStateToProps = state => {
	return {
		schoolClasses: state.schoolClasses
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SchoolClassesList)
