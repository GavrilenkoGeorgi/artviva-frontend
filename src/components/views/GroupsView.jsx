import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { connect } from 'react-redux'
import { getGroups } from '../../reducers/schoolClassesReducer'
import { setNotification,  setFetchingData } from '../../reducers/notificationReducer'
import schoolClassesService from '../../services/schoolClasses'
import { removeFalsyProps, pureObjectIsEmpty } from '../../utils/objectHelpers'
import { filter } from '../../data/forms/groupFields.json'

import { Link } from 'react-router-dom'
import { Container, Col, Row, Form } from 'react-bootstrap'
import GroupsList from '../schoolClasses/GroupsList'
import { LoadingIndicator } from '../common'
import CommonLayout from './CommonLayout'
import GroupForm from '../forms/GroupForm'
import Reset from '../forms/buttons/Reset'
import { Button } from '../common/buttons'

import { ShowFilterSettings, FilterData } from '../sorting'

const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const GroupsView = ({ user, getGroups, setNotification, groups }) => {

	const [groupsList, setGroupsList] = useState([])
	const [filterSettings, setFilterSettings] = useState({})
	const [addModalShow, setAddModalShow] = useState(false)

	useEffect(() => {
		if (user) {
			setFetchingData(true)
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

		value ? setFilterSettings({ ...filterSettings, [field]: value }) : setFilterSettings({ [field]: '' })
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
		<CommonLayout>
			<Container>
				<Row className="d-flex align-items-center">

					<Col xs={12}>
						{user
							? <h4 className="text-center custom-font">
								{`${user.superUser ? 'Всі' : 'Ваші'} групи в школи`}
							</h4>
							: null
						}
					</Col>

					<Col xs={12} className="py-3">
						<section className="school-explained custom-font-small">
							<p>
								Наприклад: щоб дізнатись, скільки студентів навчається на одному факультеті,{' '}
								введіть кілька літер від його назви та відсортуйте за ним.
							</p>
							<p>
							Для створення групи, ви повинні бути впевнені, що ви
								{user && !user.teacher
									? <>{' '}
										заповнили <Link to={`/school/users/${user.id}`}>
										анкету вчителя</Link>, та </>
									: ' '}
								створили <Link to="/school/pupils">учнів</Link> для вашої нової групи.
							</p>
						</section>
					</Col>

					<Col xs={12} className="px-0">
						<Form onReset={() => setFilterSettings({})}>
							{/*Filter by specialty and teacher chars */}
							<Col xs={12}>
								<Row>
									<FilterData
										filter={changeFilterSetting}
										fieldName="specialty"
										placeholder="Назва фаху"
									/>
									<FilterData
										filter={changeFilterSetting}
										fieldName="teacher"
										placeholder="Прізвище вчителя"
									/>
								</Row>
							</Col>
							{/* Buttons */}
							<Col xs={12} className="my-3">
								<Row>
									<Col xs={6}>
										<Button
											block
											dataCy="add-new-group"
											label="Додати нову"
											onClick={() => setAddModalShow(true)}
										/>
									</Col>
									<Col xs={6}>
										<Reset
											label="Показати всі"
											block
											variant="outline-success"
											dataCy="filter-reset-btn"
											disabled={pureObjectIsEmpty(filterSettings)}
										/>
									</Col>
								</Row>
							</Col>
						</Form>
					</Col>

					{/* Current filter settings display */}
					<Col xs={12}>
						<ShowFilterSettings
							labels={[ ...filter ]}
							settings={filterSettings}
						/>
					</Col>
					<Col xs={12}>
						<p className="pb-2 text-right text-muted">
							<small>
								<em>
									Загалом: {groupsList.length}
								</em>
							</small>
						</p>
					</Col>

					{user
						? <Col xs={12}>
							<GroupsList groups={groupsList}/>
						</Col>
						: null
					}
					<Suspense fallback={
						<LoadingIndicator
							animation="border"
							variant="primary"
							size="md"
						/>}>
						<LazyEntityEditModal
							subject="Додати нового вчителя"
							show={addModalShow}
							onHide={() => setAddModalShow(false)}
						>
							<GroupForm mode='create' />
						</LazyEntityEditModal>
					</Suspense>
				</Row>
			</Container>
		</CommonLayout>
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
