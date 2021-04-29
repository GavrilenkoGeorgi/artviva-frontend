import React, { useEffect, useState, Suspense } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Redirect } from 'react-router-dom'

import { deleteSpecialty } from '../../reducers/specialtiesReducer'
import { setNotification } from '../../reducers/notificationReducer'
import routes from '../../services/routes'

import { Row, Col } from 'react-bootstrap'
import CommonLayout from '../CommonLayout' //!! folder
import PageHeader from '../common/layout/PageHeader'
import EntityControlButtons from '../common/EntityControlButtons'
import LoadingIndicator from '../common/LoadingIndicator'

const LazyEntityDeleteModal = React.lazy(() => import('../common/EntityDeleteModal'))

const SpecialtyDetails = ({ match, specialties, deleteSpecialty, setNotification }) => {
	const [ details, setDetails ] = useState(null)
	const [deleteModalShow, setDeleteModalShow] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [redirect, setRedirect] = useState({
		to: null
	})

	useEffect(() => {
		if (specialties.length) {
			const [ spec ] = specialties.filter(spec => spec.id === match.params.id)
			setDetails(spec)
		}
	}, [ match.params.id, specialties ])

	const handleDelete = id => {
		setIsDeleting(true)
		deleteSpecialty(id)
			.then(() => {
				setNotification({
					message: 'Фах успішно видален.',
					variant: 'success'
				}, 5)
				setDeleteModalShow(false)
				setRedirect({ to: '/school/specialties' })
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => {
				setIsDeleting(false)
			})
	}

	if (redirect.to) return <Redirect to={redirect.to} />

	return <CommonLayout>
		<Col className="text-center">
			<PageHeader className="custom-font text-muted">
				Деталі фаху
			</PageHeader>
		</Col>
		{details && <Col lg={8}>
			<h2 className="display-4 text-center">
				{details.title}
			</h2>
			<Row className="py-4">
				<Col xs={12} md={6} className="mb-4">
					<p className="lead">Ціна: {details.cost} грн</p>
				</Col>
				<Col xs={12} md={6}>
					<p className="lead">{details.info}</p>
				</Col>
				<Col>
					<p className="mb-2">Класів по цьому фаху: {details.schoolClasses.length}</p>
					<p>Вчителів цього фаху: {details.teachers.length}</p>
				</Col>
				{/* Buttons */}
				<Col>
					<EntityControlButtons
						entity="specialty"
						route={`/school/${routes.specialties}/${details.id}`}
						openDeleteModal={() => setDeleteModalShow(true)}
					/>
				</Col>
			</Row>
			<Row>
				{/* Delete modal */}
				<Suspense fallback={
					<LoadingIndicator
						animation="border"
						variant="primary"
						size="md"
					/>}>
					<LazyEntityDeleteModal
						subject="Видалити фах"
						subjectid={details.id}
						valuetoconfirm={details.title}
						show={deleteModalShow}
						handleDelete={handleDelete}
						loadingState={isDeleting}
						onHide={() => setDeleteModalShow(false)}
					/>
				</Suspense>
			</Row>
		</Col>
		}
	</CommonLayout>
}

const getSpecialties = createSelector(
	state => state.specialties,
	(specialties) => specialties
)

const mapStateToProps = (state) => {
	return {
		specialties: getSpecialties(state)
	}
}

const mapDispatchToProps = {
	deleteSpecialty,
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SpecialtyDetails)
