const notificationReducer =
	(state = {
		message: null,
		variant: null,
		processingForm: false,
		fetchingData: false
	}, action) => {

		switch (action.type) {
		case 'SET_NOTIFICATION':
			return { ...state,
				message: action.message,
				variant: action.variant
			}
		case 'CLOSE_NOTIFICATION':
			return { ...state,
				message: null,
				variant: null
			}
		case 'SET_PROCESSING_FORM':
			return { ...state,
				processingForm: action.processingForm
			}
		case 'SET_FETCHING_DATA':
			return { ...state,
				fetchingData: action.fetchingData }
		default:
			return state
		}
	}

// set notification with auto close timeout
export const setNotification = (notification, time) => {
	return dispatch => {
		dispatch ({
			type: 'SET_NOTIFICATION',
			message: notification.message,
			variant: notification.variant
		})
		setTimeout(() => {
			dispatch ({
				type: 'CLOSE_NOTIFICATION'
			})
		}, time * 1000)
	}
}

// manually close notification
export const closeNotification = () => {
	return dispatch => {
		dispatch ({
			type: 'CLOSE_NOTIFICATION'
		})
	}
}

export const setProcessingForm = processingForm => {
	return dispatch => {
		dispatch ({
			type: 'SET_PROCESSING_FORM',
			processingForm
		})
	}
}

export const setFetchingData = fetchingData => {
	return dispatch => {
		dispatch ({
			type: 'SET_FETCHING_DATA',
			fetchingData
		})
	}
}

export default notificationReducer
