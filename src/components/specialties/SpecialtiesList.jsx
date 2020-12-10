import React, { useEffect, Suspense } from 'react'
import { connect } from 'react-redux'
import { setNotification, setFetchingData } from '../../reducers/notificationReducer'
import { initializeSpecialties } from '../../reducers/specialtiesReducer'
import PropTypes from 'prop-types'

import { ListGroup, Col } from 'react-bootstrap'
import { CollapseComponent, LoadingIndicator } from '../common'
import Specialty from './Specialty'

const LazySpecialtyForm = React.lazy(() => import('../forms/SpecialtyForm'))

const SpecialtiesList = ({ user,
	initializeSpecialties,
	specialties,
	setNotification,
	setFetchingData }) => {

	useEffect(() => {
		if (user) {
			setFetchingData(true)
			initializeSpecialties()
				.catch(error => {
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше:
							${error.status} ${error.statusText}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => setFetchingData(false))
		}
	}, [user, initializeSpecialties, setNotification, setFetchingData])

	return (
		<Col className="border1 border-primary">
			{specialties.length
				? <>
					<p className="py-3 text-muted">
						<em>Список усіх спеціальностей школи.</em>
					</p>
					<ListGroup>
						{specialties.map((specialty, idx) =>
							<ListGroup.Item
								className="px-0 py-1"
								key={specialty.id}
							>
								<Specialty orderNumber={idx + 1} specialty={specialty} />
							</ListGroup.Item>
						)}
					</ListGroup>
				</>
				: <p className="text-warning">
					Схоже, у вас ще немає спеціальностей у вашій школі, будь ласка, створіть їх.
				</p>
			}
			<p className="py-3 text-muted">
				Щоб створити спеціальність, вам потрібна така інформація:
				<strong> назва спеціальності, вартість</strong>.
				Додаткова інформація не є обов&apos;язковою.
			</p>

			<CollapseComponent
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
			</CollapseComponent>
		</Col>
	)
}

SpecialtiesList.propTypes = {
	user: PropTypes.object,
	setNotification: PropTypes.func.isRequired,
	initializeSpecialties: PropTypes.func.isRequired,
	setFetchingData: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		specialties: state.specialties
	}
}

const mapDispatchToProps = {
	setNotification,
	initializeSpecialties,
	setFetchingData
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SpecialtiesList)
