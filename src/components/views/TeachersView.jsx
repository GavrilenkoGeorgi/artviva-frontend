import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import * as data from '../../data/teachers'
import TeacherCard from '../teachers/TeacherCard'
import Department from '../teachers/Department'
import { shuffle } from '../../utils/shuffleArray'
import PropTypes from 'prop-types'

const TeachersView = ({ match }) => {
	const [administration, setAdministration] = useState(null)
	const [departments, setDepartments] = useState(null)

	useEffect(() => {
		setAdministration(data.administration)
		setDepartments(data.departments)
	}, [setAdministration, setDepartments])

	return (
		<Container>
			<Row className="p111-2 d-flex1 justify-content-center border1 border-primary">
				<Col xs={12} md={10} className="px212-2">
					<h3 className="text-center custom-font py-4">
						Адміністрація
					</h3>
					{administration
						? administration.map(person =>
							<TeacherCard key={person.id} person={person} />)
						: null
					}
				</Col>
				<Col xs={12} md={10} className="p111-1">
					<h3 className="text-center custom-font py-4">
						Наші вчителі
					</h3>
					{departments
						? departments.map(department =>
							<Department
								key={department.id}
								name={department.name}
								teachers={shuffle(department.teachers)}
								scrollTo={match ? match.params.department : 'default'}
							/>)
						: null
					}
				</Col>
			</Row>
		</Container>
	)
}

TeachersView.propTypes = {
	match: PropTypes.object
}

export default TeachersView
