import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { deleteSpecialty } from '../../reducers/specialtiesReducer'
import specialtyService from '../../services/specialties'
import PropTypes from 'prop-types'

import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import LoadingIndicator from '../common/LoadingIndicator'
import SpecialtyForm from '../forms/SpecialtyForm'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Specialty = ({ user, specialty, deleteSpecialty, setNotification }) => {

	const [open, setOpen] = useState(false)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const unmounted = useRef(false)

	// set auth token
	useEffect(() => {
		specialtyService.setToken(user.token)
		return () => { unmounted.current = true }
	}, [user])

	const handleDelete = id => {
		setIsDeleting(true)
		deleteSpecialty(id)
			.then(() => {
				setNotification({
					message: 'Спеціальність успішно видалена.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				if (error.response) {
					const { message } = error.response.data
					message
						? setNotification({
							message,
							variant: 'warning'
						}, 5)
						: setNotification({
							message: error.response.statusText,
							variant: 'danger'
						}, 5)
				// this..
				} else if (error.request) {
					console.error(error.request)
				} else {
					console.error('Error', error.message)
				}
				setIsDeleting(false)
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
				aria-controls="specialty-collapse"
				aria-expanded={open}
				variant="link"
				className="d-flex justify-content-between align-items-center"
			>
				<span>
					{specialty.title}
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
							<p>Назва: {specialty.title}</p>
							<p>Вартість: {specialty.cost} грн</p>
							<p>Інфо: {specialty.info}</p>
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

			{/* Specialty edit and delete modals */}
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				<LazyEntityEditModal
					subject="спеціальність"
					subjectid={specialty.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<SpecialtyForm
						closeModal={() => setEditModalShow(false)}
						specialty={specialty}
						mode="edit"
					/>
				</LazyEntityEditModal>
				<LazyEntityDeleteModal
					subject="спеціальність"
					subjectid={specialty.id}
					valuetoconfirm={specialty.title}
					show={deleteModalShow}
					handleDelete={handleDelete}
					loadingState={isDeleting}
					onHide={() => setDeleteModalShow(false)}
				/>
			</Suspense>
		</>
	)
}

Specialty.propTypes = {
	user: PropTypes.object,
	specialty: PropTypes.object.isRequired,
	setNotification: PropTypes.func.isRequired,
	deleteSpecialty: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification,
	deleteSpecialty
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Specialty)
