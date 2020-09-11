import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { setNotification, setFetchingData } from '../../reducers/notificationReducer'
import pupilsService from '../../services/pupils'

import { Link } from 'react-router-dom'
import { Container, Row, Col, ListGroup } from 'react-bootstrap'
import Pupil from './Pupil'
import LoadingIndicator from '../common/LoadingIndicator'

const PupilsList = ({
	user,
	list,
	getPupils,
	fetchingData,
	setFetchingData,
	setNotification }) => {

	const componentIsMounted = useRef(true)

	useEffect(() => {
		if (user) {
			setFetchingData(true)
			pupilsService.setToken(user.token)
			getPupils(user.id)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше: ${message}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => {
					if (componentIsMounted.current) setFetchingData(false)
				})
		}
	}, [user, getPupils, setNotification, setFetchingData])

	const checkPupilStatus = pupil => {
		const { currentlyEnrolled, docsPresent } = pupil
		return (!currentlyEnrolled)
			? 'danger-background pupil-not-enrolled'
			: (!docsPresent ? 'warning-background': null)
	}

	const quantity = length => {
		return length === 0
			? 'Ще не зачислен до жодної групи'
			: (length === 1)
				? `${length} група`
				: (length <= 4)
					? `${length} групи`
					: `${length} груп`
	}

	return (
		<>
			{fetchingData
				? <LoadingIndicator
					animation="border"
					variant="primary"
				/>
				: <>
					{list.length
						? <ListGroup>
							{list.map((pupil, index) =>
								<ListGroup.Item
									className={`animated slow fadeIn p-0 p-sm-3 ${checkPupilStatus(pupil)}`}
									key={pupil.id}
								>
									<Container>
										<Row className="pb-2">
											<Col xs={12} className="px-0">
												<Pupil pupil={pupil} posInList={index + 1} />
											</Col>
											<Col xs={12}>
												<Row className="justify-content-around py-2">
													{pupil.schoolClasses.map(group =>
														<Col xs={11} md={5}
															key={group.id} className="my-2 pupil-groups">
															<Link to={`/school/groups/${group.id}`}>
																<p className="group-title">{group.specialty.title}</p>
															</Link>
															<p className="group-teacher">
																{group.teacher.name}
															</p>
															<em className="text-muted"><small>{group.title}</small></em>
														</Col>
													)}
												</Row>

											</Col>
											<Container>
												<Row>
													<Col sm={12}>
														<Link to={`/school/pupils/f1/${pupil.id}`}>
															<em className="text-secondary">Фах:{' '}
																{pupil.specialty.title}</em>
														</Link><br />
														<em className="text-muted1">{pupil.artSchoolClass} клас ДШМ</em>
													</Col>
													<Col xs={12} className="text-right">
														<em className="text-muted">
															{quantity(pupil.schoolClasses.length)}
														</em>
													</Col>
												</Row>
											</Container>
										</Row>
									</Container>
								</ListGroup.Item>
							)}
						</ListGroup>
						: <h6 className="text-muted custom-font">
							<em>
								Не знайдено жодного учня, або у вас ще немає учнів,{' '}
								ви можете додати свого першого учня через форму &apos;Додати нового учня&apos; нижче.
							</em>
						</h6> }
				</>
			}
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		pupils: state.pupils,
		user: state.user,
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setFetchingData,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilsList)
