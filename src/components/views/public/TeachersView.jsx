import React from 'react'
import { Helmet } from 'react-helmet'

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
		<Helmet>
			<title>Вчителі школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Чинний і колишній педагогічний колектив." />
		</Helmet>
		<Col md={10}>
			<h1 className="text-center custom-font mb-5">
				Дирекція
			</h1>
			{administration.map(person =>
				<TeacherCard key={person.id} person={person} />)
			}
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
