import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { deleteBranch } from '../../reducers/branchesReducer'
import { setNotification } from '../../reducers/notificationReducer'

import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import BranchForm from '../forms/BranchForm'
import LoadingIndicator from '../common/LoadingIndicator'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))
const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Branch = ({ user, branch, deleteBranch }) => {

	const [open, setOpen] = useState(false)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const unmounted = useRef(false)

	// set auth token
	useEffect(() => {
		return () => { unmounted.current = true }
	}, [user])

	const handleDelete = id => {
		deleteBranch(id)
			.then(() => {
				setNotification({
					message: 'Філія успішно видалена.',
					variant: 'success'
				}, 5)
			})
			.catch(error => {
				const notification = JSON.parse(error.request.responseText)
				setNotification({
					message: notification.error,
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
				aria-controls="branch-collapse"
				aria-expanded={open}
				variant="link"
				className="d-flex justify-content-between align-items-center"
			>
				<span>
					{branch.town}
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
							<p>Назва: {branch.name}</p>
							<p>Місто: {branch.town}</p>
							<p>Тел: {branch.phone}</p>
							<p>Адреса: {branch.address}</p>
							<p>Інфо: {branch.info}</p>
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

			{/* Branch edit, delete modals */}
			<Suspense fallback={
				<LoadingIndicator
					animation="border"
					variant="primary"
					size="md"
				/>}>
				<LazyEntityEditModal
					subject="філію"
					subjectid={branch.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<BranchForm
						closeModal={() => setEditModalShow(false)}
						branch={branch}
						mode="edit"
					/>
				</LazyEntityEditModal>
				<LazyEntityDeleteModal
					subject="філію"
					subjectid={branch.id}
					valuetoconfirm={branch.name}
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
	deleteBranch
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Branch)
