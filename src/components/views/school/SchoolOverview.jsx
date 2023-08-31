import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { initializeSchoolStats } from '../../../reducers/schoolStatsReducer'
import { setFetchingData } from '../../../reducers/notificationReducer'

import { Container, Row, Col } from 'react-bootstrap'
import CommonLayout from '../../CommonLayout'
import Emoji from '../../common/Emoji'

const SchoolOverview =({
	user,
	schoolStats,
	initializeSchoolStats,
	setFetchingData }) => {

	const [stats, setStats] = useState(null)

	useEffect(() => {
		if (user) {
			setFetchingData(true)
			initializeSchoolStats()
				.then(() => setFetchingData(false))
		}
	}, [user, initializeSchoolStats, setFetchingData])

	useEffect(() => {
		if (schoolStats) {
			const listSize = 6
			const topGroups = schoolStats.schoolClasses
				.sort((one, other) => one.pupils.length - other.pupils.length)

			const accomplishments =
				schoolStats.teachers
					.filter(teacher => teacher.accomplishmentsDscr)
					.map(teacher => ({
						id: teacher.id,
						name: teacher.name,
						accomplishments: teacher.accomplishmentsDscr,
						experience: teacher.experienceToDate
					}))

			setStats(stats => ({
				...stats,
				topGroups: topGroups.reverse().slice(0, listSize),
				accomplishments
			}))
		}
	}, [schoolStats])

	return <>
		<Helmet>
			<title>Статистика школи</title>
			<meta name="description" content="Професійні досягнення вчителів та найбільші групи." />
		</Helmet>
		<CommonLayout>
			{user && !user.superUser
				? <Redirect to="/school" />
				: <Container>
					<Row className="d-flex justify-content-center">
						<Col xs={12}>
							<h5 className="mb-5 custom-font text-center">
								Професійні досягнення вчителів та найбільші групи
							</h5>
						</Col>
						<Col md={6}>
							<Row className="px-3 d-flex flex-column justify-content-center">
								<Col xs={12}>
									<h6 className="text-muted my-3 pl-0">
										<Emoji label="Trophy" emoji={'🏆'} />
										Професійні досягнення
									</h6>
								</Col>
								<Col>
									{stats && stats.accomplishments.map(teacher =>
										<Row
											key={teacher.id}
											className="p-2 mb-2 top-ten-colors animated fadeIn rounded"
										>
											<Col xs={12}>
												<p className="text-muted mb-2">
													<strong><em>{teacher.name}</em></strong>
												</p>
											</Col>
											<Col xs={12} className="">
												{teacher.accomplishments}
											</Col>
										</Row>
									)}
								</Col>
							</Row>
						</Col>

						<Col xs={12} md={6}>
							<Row className="px-3 d-flex justify-content-center">
								<Col xs={12}>
									<h6 className="text-muted my-3 pl-0">
										<Emoji label="Graduation Cap" emoji={'🎓'} />
										Найбільші групи
									</h6>
								</Col>
								<Col>
									{stats && stats.topGroups.map(group =>
										<Row
											key={group.title}
											className="p-2 mb-2 top-ten-colors animated fadeIn rounded"
										>
											{group.teacher.teacherTitle !== 'Немає педагогічного звання'
												? <Col xs={12} className="text-muted">
													<small><em>{group.teacher.teacherTitle}</em></small>
												</Col>
												: null
											}
											<Col xs={12}>
												<small><em>{group.teacher.name}</em></small>
											</Col>
											<Col xs={12} lg={8} className="text-secondary">
												<strong>{group.title}</strong>
											</Col>
											<Col xs={12} lg={4} className="text-right">
												{group.pupils.length} учнів
											</Col>
										</Row>
									)}
								</Col>
							</Row>
						</Col>
					</Row>
				</Container>
			}
		</CommonLayout>
	</>
}

const mapStateToProps = state => {
	return {
		user: state.user,
		schoolStats: state.schoolStats
	}
}

const mapDispatchToProps = {
	initializeSchoolStats,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SchoolOverview)
