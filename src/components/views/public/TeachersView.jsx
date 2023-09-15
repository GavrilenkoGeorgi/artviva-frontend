import React from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

import { Col } from 'react-bootstrap'
import CommonLayout from '../../CommonLayout'
import Department from '../../teachers/Department'
import teachers from '../../../data/teachers'
import { shuffle } from '../../../utils/shuffleArray'

import styles from './TeachersView.module.sass'

const TeachersView = ({ match }) => {

	const { administration, departments, formerTeachers } = teachers

	return <CommonLayout>
		<Helmet>
			<title>Вчителі школи мистецтв «АРТ ВІВА»</title>
			<meta
				name="description"
				content="Чинний і колишній педагогічний колектив школи мистецтв «АРТ ВІВА»."
			/>
			<meta
				name="keywords"
				content="вчителі, філії, школа, мистецтв, арт, віва, artviva"
			/>
		</Helmet>
		<Col md={10} className={styles.container}>
			<h1>
				Дирекція
			</h1>
			{administration.map(department =>
				<Department
					key={department.id}
					name={department.name}
					teachers={shuffle(department.teachers)}
					scrollTo={match ? match.params.department : 'default'}
				/>)
			}
			<h2>
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
			<h2>
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
