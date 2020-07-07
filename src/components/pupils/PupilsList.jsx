import React, { useEffect, useState, Suspense, useRef } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import pupilsService from '../../services/pupils'
import { nestedSort } from '../../utils/arrayHelpers'

import { Container, Row, Col, ListGroup } from 'react-bootstrap'
import Pupil from './Pupil'
import LoadingIndicator from '../common/LoadingIndicator'
import CollapseForm from '../common/CollapseForm'
import SortingControls from '../common/SortingControls'

const LazyPupilForm = React.lazy(() => import('../forms/PupilForm'))

const PupilsList = ({
	user,
	pupils,
	getPupils,
	setNotification }) => {

	const [isLoading, setIsLoading] = useState(true)
	const [pupilsData, setPupilsData] = useState([])
	const componentIsMounted = useRef(true)

	const defaultSortOrder = {
		name: false,
		artSchoolClass: false,
		docsPresent: false,
		currentlyEnrolled: false
	}

	const [sortOrder, setSortOrder] = useState(defaultSortOrder)

	const filterBy = [
		{
			fieldName: 'name',
			label: 'Ім\'я учня'
		},
		{
			fieldName: 'specialty',
			label: 'Фах'
		}
	]

	const sortBy = [
		{
			fieldName: 'name',
			label: 'Ім\'я учня'
		},
		{
			fieldName: 'artSchoolClass',
			label: 'Поточний клас'
		},
		{
			fieldName: 'docsPresent',
			label: 'Надав усі документи'
		},
		{
			fieldName: 'currentlyEnrolled',
			label: 'Зарахован до навчання'
		},
	]

	useEffect(() => {
		if (user) {
			pupilsService.setToken(user.token)
			getPupils(user.id)
				.catch(error => {
					const { message } = { ...error.response.data }
					setNotification({
						message: `Щось пішло не так, спробуйте пізніше: ${message}`,
						variant: 'danger'
					}, 5)
				})
				.finally(() => {
					if (componentIsMounted.current) setIsLoading(false)
				})
		}
	}, [user, getPupils, setNotification])

	useEffect(() => {
		setPupilsData(pupils)
	}, [pupils])

	const checkPupilStatus = pupil => {
		const { currentlyEnrolled, docsPresent } = pupil
		return (!currentlyEnrolled && !docsPresent)
			? 'danger-background'
			: (!currentlyEnrolled || !docsPresent ? 'warning-background': null)
	}

	const sort = ({ id: field }) => {
		setSortOrder({ ...defaultSortOrder, [field]: !sortOrder[field] })
		const search = {
			field,
			sortOrder: sortOrder[field] ? 'desc' : 'asc'
		}
		pupilsData.sort(nestedSort(search.field, null, search.sortOrder))
	}

	const filter = ({ target }) => {
		const { name, value } = target
		let result
		if (name === 'specialty') {
			result = pupils
				.filter(pupil => pupil[name]['title'] // data structure ((
					.toUpperCase()
					.includes(value.toUpperCase()))
		} else {
			result = pupils
				.filter(pupil => pupil[name]
					.toUpperCase()
					.includes(value.toUpperCase()))
		}
		setPupilsData([...result])
	}

	return (
		<>
			{isLoading
				? <LoadingIndicator
					animation="border"
					variant="primary"
				/>
				: <>
					<Container>
						<Row className="pt-3 d-flex justify-content-center">
							<Col xs={12} md={8} xl={6} className="order-xl-1">
								<CollapseForm
									title="Додати нового учня"
									ariaControls="pupil-add-form-collapse"
								>
									<Suspense
										fallback={
											<LoadingIndicator
												animation="border"
												variant="primary"
											/>}>
										<LazyPupilForm mode="create" />
									</Suspense>
								</CollapseForm>

								<SortingControls
									sortOrder={sortOrder}
									filter={filter}
									filterBy={filterBy}
									sort={sort}
									sortBy={sortBy}
								/>
							</Col>

							<Col xs={12} md={8} xl={6} className="order-xl-0">
								<h6 className="text-muted mt-2 mb-3">
									<em>Список учнів.</em>
								</h6>

								<ListGroup>
									{pupilsData.map(pupil =>
										<ListGroup.Item
											className={`px-0 py-1 ${checkPupilStatus(pupil)}`}
											key={pupil.id}
										>
											<Pupil pupil={pupil} />
										</ListGroup.Item>
									)}
								</ListGroup>

							</Col>
						</Row>
					</Container>
				</>
			}
		</>
	)
}

const mapStateToProps = (state) => {
	return {
		pupils: state.pupils,
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification
	// initializePupils
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PupilsList)
