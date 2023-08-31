import React, { Suspense } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { ListGroup, Col } from 'react-bootstrap'
import { CollapseComponent, LoadingIndicator } from '../common'
import Specialty from './Specialty'

const LazySpecialtyForm = React.lazy(() => import('../forms/SpecialtyForm'))

const SpecialtiesList = ({ specialties }) => {

	return (
		<Col>
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
			{specialties.length
				? <>
					<p className="py-3 text-muted">
						<em>Список усіх спеціальностей школи.</em>
					</p>
					<ListGroup data-cy="specialties-list">
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
		</Col>
	)
}

SpecialtiesList.propTypes = {
	specialties: PropTypes.array.isRequired
}

const mapStateToProps = state => {
	return {
		specialties: state.specialties
	}
}

export default connect(
	mapStateToProps,
	null
)(SpecialtiesList)
