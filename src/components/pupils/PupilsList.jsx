import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import pupilsService from '../../services/pupils'

import { ListGroup } from 'react-bootstrap'
import Pupil from './Pupil'
import LoadingIndicator from '../common/LoadingIndicator'

const PupilsList = ({
	user,
	list,
	getPupils,
	setNotification }) => {

	const [isLoading, setIsLoading] = useState(true)
	const componentIsMounted = useRef(true)

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

	const checkPupilStatus = pupil => {
		const { currentlyEnrolled, docsPresent } = pupil
		return (!currentlyEnrolled)
			? 'danger-background pupil-not-enrolled'
			: (!docsPresent ? 'warning-background': null)
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
								Не знайдено жодного учня, або у вас ще немає учнів,{' '}
								ви можете додати свого першого учня через форму &apos;Додати нового учня&apos; нижче.
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
