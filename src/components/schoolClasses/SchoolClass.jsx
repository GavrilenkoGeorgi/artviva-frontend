import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setNotification } from '../../reducers/notificationReducer'
import { deleteSchoolClass } from '../../reducers/schoolClassesReducer'
import schoolClassesService from '../../services/schoolClasses'

import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import SchoolClassForm from '../forms/SchoolClassForm'
import LoadingIndicator from '../common/LoadingIndicator'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const SchoolClass = ({ user, schoolClass, deleteSchoolClass }) => {
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
				className="d-flex justify-content-between align-items-center"
			>
				<span>
					{schoolClass.title} - {schoolClass.specialty.title}
				</span>
				{ open
					? <FontAwesomeIcon icon={faAngleUp} />
					: <FontAwesomeIcon icon={faAngleDown} />
				}
			</Button>
			<Collapse in={open}>
				<Container fluid className="text-left">
					<Row>
						<Col>
							<p>Вчітель: <strong>{schoolClass.teacher.name}</strong>
								<small>
									<Link
										to={`/school/teachers/${schoolClass.teacher.id}`}
										className="px-2"
									>
										<FontAwesomeIcon icon={faInfoCircle} />
									</Link>
								</small>
							</p>
							<p>Фах: <strong>{schoolClass.specialty.title}</strong></p>
							{schoolClass.info
								? <p>Опіс: <strong>{schoolClass.info}</strong></p>
								: null
							}
							Учні:
							<ol>
								{schoolClass.pupils.map(pupil => (
									<li key={pupil.id}>
										{pupil.name}
										{pupil.info
											? <em className="text-primary">: {pupil.info}</em>
											: null
										}
									</li>
								))}
							</ol>
						</Col>
					</Row>

					<Row>
						<EntityControlButtons
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
					subjectid={schoolClass.id}
					valuetoconfirm={schoolClass.title}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={isDeleting}
					onHide={() => setDeleteModalShow(false)}
				/>
				<LazyEntityEditModal
					subject="клас"
					subjectid={schoolClass.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<SchoolClassForm
						closeModal={() => setEditModalShow(false)}
						schoolClass={schoolClass}
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
