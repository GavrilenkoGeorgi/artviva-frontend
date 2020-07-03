import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { initializeSchoolStats } from '../../reducers/schoolStatsReducer'
import { setNotification } from '../../reducers/notificationReducer'

import { Container, Row, Col } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import SchoolStatsTable from '../common/SchoolStatsTable'

const SchoolOverview = ({ schoolStats, initializeSchoolStats, setNotification }) => {

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		initializeSchoolStats()
			.catch(error => {
				setNotification({
					message: `Щось пішло не так, спробуйте пізніше:
						${error.status} ${error.statusText}`,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setIsLoading(false))
	}, [setNotification, initializeSchoolStats])

	return (
		<Container>
			<Row className="d-flex justify-content-center">
				<Col md={8}>
					<p className="pt-3">
						Списки вчителів, учнів та філій, оплата та інша інформація.
					</p>
					{isLoading
						? <LoadingIndicator
							animation="border"
							variant="primary"
						/>
						: <>
							<SchoolStatsTable
								link="/school/schoolclasses"
								linkText={`Групи: ${schoolStats.schoolClasses.length} шт.`}
								header1stCol="№"
								header2ndCol="Назва"
								fieldName="title"
								stats={schoolStats.schoolClasses}
							/>
							<SchoolStatsTable
								link="/school/teachers"
								linkText={`Вчітелі: ${schoolStats.teachers.length} шт.`}
								header1stCol="№"
								header2ndCol="Ім&apos;я"
								fieldName="name"
								stats={schoolStats.teachers}
							/>
							<SchoolStatsTable
								link="/school/pupils"
								linkText={`Учні: ${schoolStats.pupils.length} шт.`}
								header1stCol="№"
								header2ndCol="Ім&apos;я"
								fieldName="name"
								stats={schoolStats.pupils}
							/>
							<SchoolStatsTable
								link="/school/specialties"
								linkText={`Спеціальності: ${schoolStats.specialties.length} шт.`}
								header1stCol="№"
								header2ndCol="Назва"
								fieldName="title"
								stats={schoolStats.specialties}
							/>
						</>
					}
				</Col>
			</Row>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		schoolStats: state.schoolStats
	}
}

const mapDispatchToProps = {
	initializeSchoolStats,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SchoolOverview)
