import React from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'

import { Link } from 'react-router-dom'
import { ListGroup, Row, Col } from 'react-bootstrap'
import SchoolClass from './SchoolClass'

const SchoolClassesList = ({ schoolClasses }) => {

	return (
		<>
			<Col>
				<p className="py-3 text-muted">
							Для створення групи, ви повинні бути впевнені,
							що ви створили <Link to="/school/teachers">вчителя</Link>,&nbsp;
					<Link to="/school/specialties">спеціальність</Link> та&nbsp;
					<Link to="/school/pupils">учнів</Link> для вашої нової групи.
				</p>
			</Col>
			<ListGroup>
				{schoolClasses.map(schoolClass =>
					<ListGroup.Item
						key={schoolClass.id}
					>
						<Row>
							<Col xs={12}>
								<SchoolClass schoolClass={schoolClass}/>
							</Col>
							<Col>
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

const mapStateToProps = (state) => {
	return {
		user: state.user,
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
