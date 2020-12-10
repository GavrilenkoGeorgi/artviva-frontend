import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { initializeSchoolStats } from '../../../reducers/schoolStatsReducer'
import { initialisePayments } from '../../../reducers/paymentsReducer'
import { setNotification } from '../../../reducers/notificationReducer'
import { nestedSort } from '../../../utils/arrayHelpers'
import { pureObjectIsEmpty } from '../../../utils/objectHelpers'

import { Container, Row, Col } from 'react-bootstrap'
import CommonLayout from '../../CommonLayout'
import LoadingIndicator from '../../common/LoadingIndicator'
import Emoji from '../../common/Emoji'

const SchoolOverview =({
	user, payments,
	schoolStats,
	initializeSchoolStats,
	setNotification,
	initialisePayments }) => {

	const [isLoading, setIsLoading] = useState(true)
	const [stats, setStats] = useState({ topTen: [], otherStats: [] })

	useEffect(() => {
		if (user) {
			initialisePayments()
				.catch(error => {
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${error.status} ${error.statusText}`,
						variant: 'danger'
					}, 5)
					setIsLoading(false)
				})
			initializeSchoolStats()
				.catch(error => {
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${error.status} ${error.statusText}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setIsLoading(false))
		}
	}, [user, initialisePayments, setNotification, initializeSchoolStats])

	useEffect(() => {
		if (payments.length > 0) {
			let result = payments.reduce((acc, d) => {
				const found = acc.find(a => a.teacher === d.paymentDescr.teacher)
				found
					? found.amount += d.amount
					: acc.push({ teacher: d.paymentDescr.teacher, amount: d.amount })
				return acc
			}, [])
			setStats({ topTen: result.sort(nestedSort('amount', null, 'desc')) })
		}

	}, [payments])

	useEffect(() => {
		if (!pureObjectIsEmpty(schoolStats)) {
			const listSize = 6
			const topGroups = schoolStats.schoolClasses.sort((one, other) => {
				return one.pupils.length - other.pupils.length
			})

			const accomplishments =
				schoolStats.teachers.map(teacher =>
					({ id: teacher.id, name: teacher.name, accomplishment: teacher.accomplishmentsDscr }))

			setStats(stats => ({
				...stats,
				topGroups: topGroups.reverse().slice(0, listSize),
				accomplishments: accomplishments
					.filter(teacher => teacher.accomplishment.length)
					.slice(0, listSize)
			}))
		}
	}, [schoolStats])

	return <CommonLayout>
		{user && !user.superUser
			? <Redirect to="/school" />
			: <Container>
				<Row className="d-flex justify-content-center">
					<h5 className="my-3 custom-font text-center">
							Списки вчителів, учнів та філій, оплата та інша інформація
					</h5>
					{isLoading
						? <LoadingIndicator
							animation="border"
							variant="primary"
						/>
						: <>
							<Col md={6}>
								<Row className="px-3 d-flex justify-content-center">
									<Col xs={12}>
										<h6 className="text-muted my-3 pl-0">
											<Emoji label="Trophy" emoji={'🏆'} /> Професійні досягнення
										</h6>
									</Col>
									<Col>
										{stats.accomplishments.map(person =>
											<Row
												key={person.id}
												className="p-2 mb-2 top-ten-colors animated fadeIn rounded"
											>
												<Col xs={12}>
													<p className="text-muted mb-2">
														<strong><em>{person.name}</em></strong>
													</p>
												</Col>
												<Col xs={12} className="">
													{person.accomplishment}
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
											<Emoji label="Graduation Cap" emoji={'🎓'} /> Найбільші групи
										</h6>
									</Col>
									<Col>
										{stats.topGroups.map(group =>
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

								{/*<Row className="px-3 d-flex justify-content-center">
									<Col xs={12}>
										<h6 className="text-muted my-3 pl-0">
											<Emoji label="Party Popper" emoji={'🎉'} /> Працівник місяця
										</h6>
									</Col>
									<Col>
										{stats.topTen.map(result =>
											<Row
												key={result.teacher}
												className="p-2 mb-2 top-ten-colors animated fadeIn rounded"
											>
												<Col xs={12} lg={8}>
													{result.teacher}
												</Col>
												<Col xs={12} lg={4} className="text-right">
													{result.amount}{' '}
													<FontAwesomeIcon icon={faHryvnia} className="text-muted pr-1"/>
												</Col>
										</Row>
										)}
									</Col>
								</Row>*/}
							</Col>
						</>
					}
				</Row>
			</Container>
		}
	</CommonLayout>
}

const mapStateToProps = state => {
	return {
		user: state.user,
		payments: state.payments,
		schoolStats: state.schoolStats
	}
}

const mapDispatchToProps = {
	initializeSchoolStats,
	setNotification,
	initialisePayments
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SchoolOverview)
