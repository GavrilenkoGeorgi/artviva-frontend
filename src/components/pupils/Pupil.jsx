import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { deletePupil } from '../../reducers/pupilsReducer'
import pupilsService from '../../services/pupils'
import { setNotification } from '../../reducers/notificationReducer'

import { Link } from 'react-router-dom'
import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import LoadingIndicator from '../common/LoadingIndicator'
import PupilForm from '../forms/PupilForm'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Pupil = ({ user, pupil, posInList, deletePupil, setNotification }) => {

	const [open, setOpen] = useState(false)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const unmounted = useRef(false)

	// set auth token
	useEffect(() => {
		pupilsService.setToken(user.token)
		return () => { unmounted.current = true }
	}, [user])

	const handleDelete = id => {
		setIsDeleting(true)
		deletePupil(id)
			.then(() => {
				setNotification({
					message: 'Учень успішно видален.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
				setIsDeleting(false)
				setDeleteModalShow(false)
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
				aria-controls="pupil-collapse"
				aria-expanded={open}
				variant="link"
				className="d-flex justify-content-between align-items-center"
			>
				<span className="text-left">
					{posInList}. {pupil.name} <em className="text-muted">{pupil.artSchoolClass} клас</em>
				</span>
				{open
					? <FontAwesomeIcon icon={faAngleUp} />
					: <FontAwesomeIcon icon={faAngleDown} />
				}
			</Button>
			<Collapse in={open}>
				<Container>
					{/* Control buttons */}
					<Row>
						<Col className="d-flex align-items-center">
							<Link to={`/school/pupils/f1/${pupil.id}`}>
								Форма Ф-1
							</Link>
						</Col>

						<EntityControlButtons
							route={`/school/pupils/${pupil.id}`}
							openEditModal={() => setEditModalShow(true)}
							openDeleteModal={() => setDeleteModalShow(true)}
						/>
					</Row>
				</Container>
			</Collapse>

			{/* Pupil edit and delete modal */}
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				<LazyEntityEditModal
					subject="учня"
					subjectid={pupil.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<PupilForm
						closeModal={() => setEditModalShow(false)}
						pupil={pupil}
						mode="edit" />
				</LazyEntityEditModal>
				<LazyEntityDeleteModal
					subject="учня"
					subjectid={pupil.id}
					valuetoconfirm={pupil.name}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={isDeleting}
					onHide={() => setDeleteModalShow(false)}
				/>
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
	deletePupil
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pupil)
