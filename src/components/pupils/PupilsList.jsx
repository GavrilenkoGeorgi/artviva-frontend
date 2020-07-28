import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import pupilsService from '../../services/pupils'
import { nestedSort } from '../../utils/arrayHelpers'

import { ListGroup } from 'react-bootstrap'
import Pupil from './Pupil'
import LoadingIndicator from '../common/LoadingIndicator'

const PupilsList = ({
	user,
	pupils,
	list,
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
		return (!currentlyEnrolled)
			? 'danger-background pupil-not-enrolled'
			: (!docsPresent ? 'warning-background': null)
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
					{list.length
						? <ListGroup>
							{list.map((pupil, index) =>
								<ListGroup.Item
									className={`px-0 py-1 ${checkPupilStatus(pupil)}`}
									key={pupil.id}
								>
									<Pupil pupil={pupil} posInList={index + 1} />
								</ListGroup.Item>
							)}
						</ListGroup>
						: <h6 className="text-muted custom-font">
							<em>
								Не знайдено жодного учня, або у вас ще немає учнів, ви можете додати свого першого учня через форму &apos;Додати нового учня&apos; нижче.
							</em>
						</h6> }
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
