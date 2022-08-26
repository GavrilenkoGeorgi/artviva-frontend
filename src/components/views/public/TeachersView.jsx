import React, { useState, useEffect } from 'react'
import { Col } from 'react-bootstrap'
import teachers from '../../../data/teachers'
import TeacherCard from '../../teachers/TeacherCard'
import Department from '../../teachers/Department'
import { shuffle } from '../../../utils/shuffleArray'
import CommonLayout from '../../CommonLayout'
import PropTypes from 'prop-types'

const TeachersView = ({ match }) => {
	const { administration, departments } = teachers
	const [admins, setAdministration] = useState(null)
	const [deps, setDepartments] = useState(null)

	useEffect(() => {
		setAdministration(administration)
		setDepartments(departments)
	// eslint-disable-next-line
	}, [setAdministration, setDepartments])

	return (
		<CommonLayout className="border">
			<Col xs={12}>
				<h1 className="text-center custom-font py-sm-4">
					Адміністрація
				</h1>
				{admins
					? admins.map(person =>
						<TeacherCard key={person.id} person={person} />)
					: null
				}
			</Col>
			<Col xs={12} className="mb-5">
				<h2 className="text-center custom-font py-4">
					Наші вчителі
				</h2>
				{deps
					? deps.map(department =>
						<Department
							key={department.id}
							name={department.name}
							teachers={shuffle(department.teachers)}
							scrollTo={match ? match.params.department : 'default'}
						/>)
					: null
				}
			</Col>
		</CommonLayout>
	)
}

TeachersView.propTypes = {
	match: PropTypes.object
}

export default TeachersView
