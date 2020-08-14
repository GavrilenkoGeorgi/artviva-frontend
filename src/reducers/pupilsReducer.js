import pupilsService from '../services/pupils'
import { compareValues } from '../utils/arrayHelpers'

const pupilsReducer = (state = [], action) => {
	switch (action.type) {
	case 'CREATE_PUPIL':
		return [...state, action.data]
	case 'DELETE_PUPIL':
		return state.filter(pupil => pupil.id !== action.data)
	case 'INIT_PUPILS':
		return action.data.reverse()
	case 'UPDATE_PUPIL': {
		const updatedPupil = action.data
		return state.map(pupil =>
			pupil.id !== action.data.id ? pupil : updatedPupil
		)
	}
	case 'SORT_PUPILS_LIST': {
		const { field, order } = { ...action.data }
		return state.slice().sort(compareValues(field, order))
	}
	default:
		return state
	}
}

/**
 * Sort pupils list
 * @param {string} field - Field to sort by
 * @param {string} order - Order of sort
*/
export const sortPupils = (field, order) => {

	const data = {
		field,
		order
	}

	return async dispatch => {
		dispatch ({
			type: 'SORT_PUPILS_LIST',
			data
		})
	}
}

/**
 * Create new pupil
 * @param {Object} payload - New pupil data
 * @param {string} payload.name - Unique pupil name
 * @param {string} payload.name - Some additional pupil info
 */
export const createPupil = payload => {
	return async dispatch => {
		const newPupil = await pupilsService.create(payload)
		dispatch ({
			type: 'CREATE_PUPIL',
			data: newPupil
		})
	}
}

/**
 * Initialise pupils
 */
export const initializePupils = () => {
	return async dispatch => {
		const pupils = await pupilsService.getAll()
		dispatch ({
			type: 'INIT_PUPILS',
			data: pupils
		})
	}
}

/**
 * Initialise list of user assigned pupils
 */
export const initialiseUserPupils = id => {
	return async dispatch => {
		const pupils = await pupilsService.getUserPupils(id)
		dispatch ({
			type: 'INIT_PUPILS',
			data: pupils
		})
	}
}

/**
 * Delete single pupil
 * @param {string} id - ID of the pupil to delete
 */
export const deletePupil = id => {
	return async dispatch => {
		await pupilsService.deleteById(id)
		dispatch ({
			type: 'DELETE_PUPIL',
			data: id
		})
	}
}

/**
 * Update pupil data
 * @param {string} id - ID of the pupil to update
 * @param {Object} payload - Pupils data
 * @param {Object} payload.name - Pupil unique name
 * @param {Object} payload.info - Some additional pupil info
 */

export const updatePupil = (id, payload) => {
	return async dispatch => {
		const updatedPupil = await pupilsService.update(id, payload)
		dispatch ({
			type: 'UPDATE_PUPIL',
			data: updatedPupil
		})
	}
}

export default pupilsReducer
