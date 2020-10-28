import recaptchaService from '../services/recaptcha'

const notificationReducer =
	(state = {
		message: null,
		variant: null,
		processingForm: false,
		fetchingData: false,
		searching: false,
		reCaptchaScore: null
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
				fetchingData: action.fetchingData
			}
		case 'SET_SEARCHING':
			return { ...state,
				searching: action.searching
			}
		case 'SET_RECAPTCHA_SCORE': {
			return { ...state,
				reCaptchaScore: action.score
			}
		}
		case 'CLEAR_RECAPTCHA_SCORE': {
			return { ...state,
				reCaptchaScore: action.score
			}
		}
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

/**
 * 'Search in progress' indicator
 *
 * @param {boolean} searching - True or false, cap!
 */

export const setSearchInProgress = searching => {
	return dispatch => {
		dispatch ({
			type: 'SET_SEARCHING',
			searching
		})
	}
}

/**
 * Verify recaptcha score
 *
 * @param {string} token - Recaptcha token to verify
 */

export const setRecaptchaScore = token => {
	if (window.Cypress) {
		return async dispatch => {
			dispatch ({
				type: 'SET_RECAPTCHA_SCORE',
				score: .9
			})
		}
	} else {
		return async dispatch => {
			const result = await recaptchaService.verify(token)
			dispatch ({
				type: 'SET_RECAPTCHA_SCORE',
				score: result.score
			})
		}
	}
}

/**
 * Clear recaptcha score
 *
 */

export const clearRecaptchaScore = () => {
	return async dispatch => {
		dispatch ({
			type: 'CLEAR_RECAPTCHA_SCORE',
			score: null
		})
	}
}

export default notificationReducer
