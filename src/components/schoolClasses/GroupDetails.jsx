import React, { useEffect, useState, Suspense, useRef } from 'react'
import { connect } from 'react-redux'
import schoolClassesService from '../../services/schoolClasses'
import { setNotification } from '../../reducers/notificationReducer'
import { deleteSchoolClass } from '../../reducers/schoolClassesReducer'

import { Link, useHistory } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import CommonLayout from '../CommonLayout'
import SchoolClassForm from '../forms/GroupForm'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const GroupDetails = ({ user, match, setNotification, deleteSchoolClass }) => {

	const [groupDetails, setGroupDetails] = useState(null)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const history = useHistory()
	const isMounted = useRef(false)

	useEffect(() => {
		isMounted.current = true
	}, [])

	useEffect(() => {
		return () => {
			isMounted.current = false
		}
	}, [])

	useEffect(() => {
		if (user) {
			schoolClassesService.setToken(user.token)
			schoolClassesService.getById(match.params.id)
				.then((data) => {
					setGroupDetails(data)
				})
				.catch(error => {
					setNotification({
						message: error.message,
						variant: 'danger'
					}, 5)
				})
		}
	// eslint-disable-next-line
	}, [user])

	const handleDelete = id => {
		setIsDeleting(true)
		deleteSchoolClass(id)
			.then(() => {
				setNotification({
					message: 'Клас успішно видален.',
					variant: 'success'
				}, 5)
				history.push('/school/groups')
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (isMounted.current) {
					setDeleteModalShow(false)
					setIsDeleting(false)
				}
			})
	}

	return (
		<CommonLayout>
			{groupDetails
				? <Container>
					<h4 className="my-2 serif-font text-center">
						{groupDetails.specialty.title} - {groupDetails.teacher.name}
					</h4>
					<Row>
						<Col xs={12}>
							<h6 className="mt-3 text-muted text-center">{groupDetails.title}</h6>
						</Col>
						<Col xs={12} className="my-3">
							<em className="text-muted">{groupDetails.info}</em>
						</Col>
						<Col>
							<Container>
								{groupDetails.pupils.map((pupil, idx) => (
									<Row key={pupil.id} className="py-2 my-2 p-lg-3 border rounded">
										<Col xs={12}>
											{`${idx + 1}. `}
											<Link to={`/school/pupils/${pupil.id}`}>
												{pupil.name}</Link>{' '}
											<em className="text-muted">{pupil.artSchoolClass} клас</em>
										</Col>
										<Col>
											<em className="text-muted">{pupil.info}</em>
										</Col>
										{ user.superUser
											? <>{pupil.assignedTo
												? <Col xs={12} className="mt-3 d-flex justify-content-end text-muted">
													<Link to={`/school/users/${pupil.assignedTo.id}`}>
														<small>
															<span className="text-muted">Відповідальний</span>{' '}
															{pupil.assignedTo.name} {pupil.assignedTo.lastname}
														</small>
													</Link>
												</Col>
												: <Col xs={12} className="mt-3 d-flex justify-content-end">
													<small className="text-warning">
														<em>Відповідальний за учня не обран!</em>
													</small>
												</Col>}
											</>
											: null }
									</Row>
								))}
							</Container>
						</Col>
					</Row>
					<Row>
						<EntityControlButtons
							route={`/school/groups/${groupDetails.id}`}
							openEditModal={() => setEditModalShow(true)}
							openDeleteModal={() => setDeleteModalShow(true)}
						/>
					</Row>
					<Row>
						{/* School class edit and delete modals*/}
						<Suspense fallback={
							<LoadingIndicator
								animation="border"
								variant="primary"
								size="md"
							/>}>
							<LazyEntityDeleteModal
								subject="Видалити клас"
								subjectid={groupDetails.id}
								valuetoconfirm={groupDetails.title}
								show={deleteModalShow}
								handleDelete={handleDelete}
								loadingState={isDeleting}
								onHide={() => setDeleteModalShow(false)}
							/>
							<LazyEntityEditModal
								subject="Редагувати клас"
								subjectid={groupDetails.id}
								show={editModalShow}
								onHide={() => setEditModalShow(false)}
							>
								<SchoolClassForm
									closeModal={() => setEditModalShow(false)}
									group={groupDetails}
									mode="edit" />
							</LazyEntityEditModal>
						</Suspense>
					</Row>
				</Container>
				: <LoadingIndicator animation="border" variant="primary" />
			}
		</CommonLayout>
	)
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification,
	deleteSchoolClass
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GroupDetails)
