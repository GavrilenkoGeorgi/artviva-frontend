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

const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Pupil = ({ user, pupil, posInList }) => {

	const [open, setOpen] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const unmounted = useRef(false)

	// set auth token
	useEffect(() => {
		pupilsService.setToken(user.token)
		return () => { unmounted.current = true }
	}, [user])

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
				<span>
					<em className="text-secondary">
						{posInList}.{' '}
					</em>
					<em>
						{pupil.name}
					</em>
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
						<Col className="my-4 d-flex align-items-center">
							<Link to={`/school/pupils/f1/${pupil.id}`}>
								Форма Ф-1
							</Link>
						</Col>

						<EntityControlButtons
							route={`/school/pupils/${pupil.id}`}
							entity="pupil"
							openEditModal={() => setEditModalShow(true)}
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
					subject="Редагувати дані учня"
					subjectid={pupil.id}
					show={editModalShow}
					onHide={() => setEditModalShow(false)}
				>
					<PupilForm
						closeModal={() => setEditModalShow(false)}
						pupil={pupil}
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
	deletePupil
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pupil)
