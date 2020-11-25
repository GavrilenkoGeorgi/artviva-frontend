import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setNotification } from '../../reducers/notificationReducer'
import { deleteSchoolClass } from '../../reducers/schoolClassesReducer'
import schoolClassesService from '../../services/schoolClasses'

import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faClipboardCheck } from '@fortawesome/free-solid-svg-icons'
import SchoolClassForm from '../forms/GroupForm'
import LoadingIndicator from '../common/LoadingIndicator'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const SchoolClass = ({ user, group, number, deleteSchoolClass }) => {
	const [open, setOpen] = useState(false)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const unmounted = useRef(false)

	// set auth token
	useEffect(() => {
		schoolClassesService.setToken(user.token)
		return () => { unmounted.current = true }
	}, [user])

	const handleDelete = id => {
		setIsDeleting(true)
		deleteSchoolClass(id)
			.then(() => {
				setNotification({
					message: 'Клас успішно видален.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				if (!unmounted) setIsDeleting(false)
			})
	}

	return (
		<>
			<Button
				block
				onClick={() => setOpen(!open)}
				aria-controls="school-class-collapse"
				aria-expanded={open}
				variant="link"
				className="p-0 d-flex text-left justify-content-between align-items-center"
			>
				<span>
					{number}. {group.title} - <em className="text-muted">{group.specialty.title}</em>{' '}
				</span>
				{ open
					? <FontAwesomeIcon icon={faAngleUp} />
					: <FontAwesomeIcon icon={faAngleDown} />
				}
			</Button>
			<Collapse in={open}>
				<Container>
					<Row>
						<Col xs={12} className="py-2 px-0">
							<p>
								<em>{group.teacher.name}</em>
								<Link
									to={`/school/teachers/${group.teacher.id}`}
									className="px-2"
								>
									<FontAwesomeIcon icon={faClipboardCheck} className="icon-info" />
								</Link>
							</p>
						</Col>
						<Col className="px-0" xs={12}>
							{group.info
								? <p className="my-3"><em className="text-muted">{group.info}</em></p>
								: null
							}
							<em>Учні:</em>
							<ol>
								{group.pupils.map(pupil => (
									<li key={pupil.id}>
										<Link to={`/school/pupils/${pupil.id}`}>{pupil.name}</Link>
										{pupil.info
											? <em className="text-secondary">: {pupil.info}</em>
											: null
										}
									</li>
								))}
							</ol>
						</Col>
					</Row>

					<Row>
						<EntityControlButtons
							route={`/school/groups/${group.id}`}
							entity="group"
							openEditModal={() => setEditModalShow(true)}
							openDeleteModal={() => setDeleteModalShow(true)}
						/>
					</Row>

				</Container>
			</Collapse>

			{/* School class edit and delete modals*/}
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				<LazyEntityDeleteModal
					subject="клас"
					subjectid={group.id}
					valuetoconfirm={group.title}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={isDeleting}
					onHide={() => setDeleteModalShow(false)}
				/>
				<LazyEntityEditModal
					subject="клас"
					subjectid={group.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<SchoolClassForm
						closeModal={() => setEditModalShow(false)}
						group={group}
						mode="edit" />
				</LazyEntityEditModal>
			</Suspense>
		</>
	)
}

const mapStateToProps = (state) => {
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
)(SchoolClass)
