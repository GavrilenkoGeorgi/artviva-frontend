import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { connect } from 'react-redux'
import { getGroups } from '../../reducers/schoolClassesReducer'
import { setNotification,  setFetchingData } from '../../reducers/notificationReducer'
import schoolClassesService from '../../services/schoolClasses'
import { removeFalsyProps, pureObjectIsEmpty } from '../../utils/objectHelpers'

import { Link } from 'react-router-dom'
import { Container, Col, Row } from 'react-bootstrap'
import GroupsList from '../schoolClasses/GroupsList'
import { CollapseComponent, LoadingIndicator } from '../common'

import { FilterData } from '../sorting'

const LazySchoolClassForm = React.lazy(() => import('../forms/GroupForm'))

const GroupsView = ({ user, getGroups, setNotification, groups }) => {

	useEffect(() => {
		setFetchingData(true)
	}, [])

	const [groupsList, setGroupsList] = useState([])
	const [filterSettings, setFilterSettings] = useState({})
	// const [currentlyActiveFilter, setCurrentlyActiveFilter] = useState('')

	useEffect(() => {
		if (user) {
			schoolClassesService.setToken(user.token)
			getGroups(user.superUser, user.teacher)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${message}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}, [user, setNotification, getGroups])

	const changeFilterSetting = (event) => {
		event.preventDefault()

		const { target } = event
		const { name: field, value } = target
		console.log('filed and value ', field, ':', value)
		switch (field) {
		case 'teacher':
		case 'specialty': {
			if (value) {
				setFilterSettings({ ...filterSettings, [field]: value })
			}
			else {
				setFilterSettings({ [field]: '' })
			}
			// setCurrentlyActiveFilter(field)
			break
		}
		case 'from':
		case 'to': {
			setFilterSettings({ ...filterSettings, [field]: value || 0 })
			// setCurrentlyActiveFilter('range')
			break
		}
		case 'isRetired':
		case 'employeeIsAStudent': {
			let statement
			if (value) {
				statement = JSON.parse(value)
			} else {
				statement = ''
			}
			setFilterSettings({ ...filterSettings, [field]: statement })
			// setCurrentlyActiveFilter('booleans')
			break
		}
		default: {
			console.log('default case')
		}
		}
	}

	const sortData = useCallback(settings => {
		let result = groups
		if (settings) {
			const { specialty, teacher } = settings
			if (specialty) {
				result =
					result.filter(item => item.specialty.title.toUpperCase().includes(settings.specialty.toUpperCase()))
			}

			if (teacher) {
				result =
					result.filter(item => item.teacher.name.toUpperCase().includes(settings.teacher.toUpperCase()))
			}
			setGroupsList([ ...result ])

		} else {
			setGroupsList([ ...groups ])
		}
	}, [groups])

	useEffect(() => {
		if (pureObjectIsEmpty(removeFalsyProps(filterSettings))) {
			sortData(null)
		} else {
			sortData(filterSettings)
		}
	}, [filterSettings, sortData])

	return (
		<Container className="px-0 d-flex justify-content-center">
			<Col md={9}>
				<Col xs={12}>
					{user
						? <h4 className="pb-3 text-center custom-font">
							{`${user.superUser ? 'Всі' : 'Ваші'} групи в школи`}
						</h4>
						: null
					}
				</Col>
				<Row className="d-flex justify-content-center">
					{/* Filter by specialty and teacher chars */}
					<Col xs={6} className="my-2">
						<FilterData
							filter={changeFilterSetting}
							fieldName="specialty"
							placeholder="Назва фаху"
						/>
					</Col>
					<Col xs={6} className="my-2">
						<FilterData
							filter={changeFilterSetting}
							fieldName="teacher"
							placeholder="Прізвище вчителя"
						/>
					</Col>
				</Row>

				<Row>
					<Col xs={12} className="pt-3">
						{user
							? <>
								<GroupsList groups={groupsList}/>

								<Col className="px-0">
									<p className="py-4 text-muted">
										Для створення групи, ви повинні бути впевнені, що ви
										{!user.teacher
											? <>{' '}
												заповнили <Link to={`/school/users/${user.id}`}>
												анкету вчителя</Link>, та </>
											: ' '}
										створили <Link to="/school/pupils">учнів</Link> для вашої нової групи.
									</p>
								</Col>

								<CollapseComponent
									title={`Додати нову групу ${user.superUser ? '(як завуч)' : '' }`}
									ariaControls="school-class-add-form-collapse"
								>
									<Suspense
										fallback={
											<LoadingIndicator
												animation="border"
												variant="primary"
											/>}>
										<LazySchoolClassForm mode="create" />
									</Suspense>
								</CollapseComponent>
							</>
							: <>Just a sec..</>
						}
					</Col>
				</Row>
			</Col>
		</Container>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user,
		groups: state.schoolClasses,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	getGroups,
	setNotification,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupsView)
