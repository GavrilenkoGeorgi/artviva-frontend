import React, { useEffect, useState, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'
import specialtiesService from '../../services/specialties'
import PropTypes from 'prop-types'

import { Container, ListGroup, Row, Col } from 'react-bootstrap'
import LoadingIndicator from '../common/LoadingIndicator'
import CollapseForm from '../common/CollapseForm'
import Specialty from './Specialty'

const LazySpecialtyForm = React.lazy(() => import('../forms/SpecialtyForm'))

const SpecialtiesList = ({ user, initializeSpecialties, specialties, setNotification }) => {

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (user) {
			specialtiesService.setToken(user.token)
			initializeSpecialties()
				.catch(error => {
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${error.status} ${error.statusText}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setIsLoading(false))
		}
	}, [user, initializeSpecialties, setNotification])

	return (
		<Container>
			<Row className="d-flex justify-content-center">
				<Col md={10} xl={8}>
					{isLoading
						? <LoadingIndicator
							animation="border"
							variant="primary"
						/>
						: <>
							<p className="py-3 text-muted">
								Щоб створити спеціальність, вам потрібна така інформація:
								<strong> назва спеціальності, вартість</strong>.
								Додаткова інформація не є обов&apos;язковою.
							</p>

							<CollapseForm
								title="Додати новій фах"
								ariaControls="specialty-add-form-collapse"
							>
								<Suspense
									fallback={
										<LoadingIndicator
											animation="border"
											variant="primary"
										/>}>
									<LazySpecialtyForm mode="create" />
								</Suspense>
							</CollapseForm>

							<p className="py-3 text-muted">
								<em>Список усіх спеціальностей школи.</em>
							</p>
							<ListGroup>
								{specialties.map(specialty =>
									<ListGroup.Item
										className="px-0 py-1"
										key={specialty.id}
									>
										<Specialty specialty={specialty} />
									</ListGroup.Item>
								)}
							</ListGroup>
						</>
					}
				</Col>
			</Row>
		</Container>
	)
}

SpecialtiesList.propTypes = {
	user: PropTypes.object,
	setNotification: PropTypes.func.isRequired,
	initializeSpecialties: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		specialties: state.specialties
	}
}

const mapDispatchToProps = {
	setNotification,
	initializeSpecialties
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SpecialtiesList)
