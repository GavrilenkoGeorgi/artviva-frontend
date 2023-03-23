import React from 'react'
import { Col } from 'react-bootstrap'
import teachers from '../../../data/teachers'
import TeacherCard from '../../teachers/TeacherCard'
import Department from '../../teachers/Department'
import { shuffle } from '../../../utils/shuffleArray'
import CommonLayout from '../../CommonLayout'
import PropTypes from 'prop-types'

const TeachersView = ({ match }) => {
	const { administration, departments, formerTeachers } = teachers
	return <CommonLayout>
		<Col xs={12} className="my-3">
			<h1 className="text-center custom-font mb-5">
				Дирекція
			</h1>
			{administration.map(person =>
				<TeacherCard key={person.id} person={person} />)
			}
		</Col>
		<Col xs={12} className="my-3"> {/* TODO: This can be one thing with the next */}
			<h2 className="text-center custom-font py-4">
				Наші вчителі
			</h2>
			{departments.map(department =>
				<Department
					key={department.id}
					name={department.name}
					teachers={shuffle(department.teachers)}
					scrollTo={match ? match.params.department : 'default'}
				/>)
			}
		</Col>
		<Col xs={12} className="my-3">
			<h2 className="text-center custom-font py-4">
				Вчителі з якими ми співпрацювали
			</h2>
			{formerTeachers.map(department =>
				<Department
					key={department.id}
					name={department.name}
					teachers={shuffle(department.teachers)}
					scrollTo={match ? match.params.department : 'default'}
				/>)
			}
		</Col>
	</CommonLayout>
}

TeachersView.propTypes = {
	match: PropTypes.object
}

export default TeachersView
