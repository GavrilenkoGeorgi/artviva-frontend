import React, { useState, useEffect, useRef, Suspense } from 'react'
import { connect } from 'react-redux'
import { updatePupil } from '../../reducers/pupilsReducer'
import { updatePupilData } from './updatePupilData'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'

import { Link } from 'react-router-dom'
import { Container, Row, Col, Collapse, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import LoadingIndicator from '../common/LoadingIndicator'
import PupilForm from '../forms/PupilForm'
import EntityControlButtons from '../common/EntityControlButtons'

const LazyEntityEditModal = React.lazy(() => import('../common/EntityEditModal'))

const Pupil = ({ user, specialties, pupil, posInList, updatePupil, setProcessingForm, setNotification }) => {

	const [open, setOpen] = useState(false)
	const [editModalShow, setEditModalShow] = useState(false)
	const unmounted = useRef(false)

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const closeModal = () => setEditModalShow(false)

	const handleUpdate = async (values, setErrors) => {
		const data = {
			values,
			userId: user.id
		}
		const utils = {
			updatePupil,
			setNotification,
			setProcessingForm,
			setErrors,
			closeModal
		}
		updatePupilData(data, utils)
	}

	return <>
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

		{/* Pupil edit modal */}
		<Suspense fallback={
			<LoadingIndicator
				animation="border"
				variant="primary"
				size="md"
			/>}>
			<LazyEntityEditModal
				subject="Редагувати дані учня"
				show={editModalShow}
				onHide={() => setEditModalShow(false)}
			>
				<PupilForm
					handleFormData={handleUpdate}
					pupil={pupil}
					specialties={specialties.map(spec => spec.title)}
					mode="edit"
				/>
			</LazyEntityEditModal>
		</Suspense>
	</>
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		specialties: state.specialties
	}
}

const mapDispatchToProps = {
	setNotification,
	updatePupil,
	setProcessingForm
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Pupil)
