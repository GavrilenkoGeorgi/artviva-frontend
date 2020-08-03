import React from 'react'

import { ListGroup, Row, Col } from 'react-bootstrap'
import Group from './Group'

const GroupsList = ({ groups }) => {

	return (
		<ListGroup className="py-2">
			{groups.map((group, idx) =>
				<ListGroup.Item
					key={group.id}
				>
					<Row>
						<Col xs={12}>
							<Group number={idx + 1} group={group}/>
						</Col>
						<Col xs={3} className="pl-4">
							<small className="text-muted">
								<em>{group.pupils.length} учів</em>
							</small>
						</Col>
						<Col xs={9}>
							<div className="text-muted text-right">
								<em>{group.teacher.name}
								</em>
							</div>
						</Col>
					</Row>
				</ListGroup.Item>
			)}
		</ListGroup>
	)
}

/*
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
*/
export default GroupsList