import specialtiesService from '../services/specialties'

const specialtiesReducer = (state = [], action) => {
	switch (action.type) {
	case 'CREATE_SPECIALTY':
		return [...state, action.data]
	case 'DELETE_SPECIALTY':
		return state.filter(specialty => specialty.id !== action.data)
	case 'INIT_SPECIALTIES':
		return action.data
	case 'UPDATE_SPECIALTY': {
		const updatedSpecialty= action.data
		return state.map(specialty =>
			specialty.id !== action.data.id ? specialty : updatedSpecialty
		)
	}
	default:
		return state
	}
}

/**
 * Create new specialty
 * @param {Object} payload - New specialty data
 * @param {string} payload.title - Unique specialty title
 * @param {string} payload.cost - Cost per month
 * @param {string} payload.info - Additional info
 */
export const createSpecialty = payload => {
	return async dispatch => {
		const newSpecialty = await specialtiesService.create(payload)
		dispatch ({
			type: 'CREATE_SPECIALTY',
			data: newSpecialty
		})
	}
}

/**
 * Initialise specialties
 */
export const initializeSpecialties = () => {
	return async dispatch => {
		const specialties = await specialtiesService.getAll()
		dispatch ({
			type: 'INIT_SPECIALTIES',
			data: specialties || [] //?
		})
	}
}

/**
 * Delete single specialty
 * @param {string} id - Id of the specialty to delete
 */
export const deleteSpecialty = id => {
	return async dispatch => {
		await specialtiesService.deleteById(id)
		dispatch ({
			type: 'DELETE_SPECIALTY',
			data: id
		})
	}
}

/**
 * Update specialty details
 * @param {string} id - Id of the specialty to update
 * @param {Object} specialty - Specialty to update
 */

export const updateSpecialty = (id, specialty) => {
	return async dispatch => {
		const updatedSpecialty = await specialtiesService.update(id, specialty)
		dispatch ({
			type: 'UPDATE_SPECIALTY',
			data: updatedSpecialty
		})
	}
}

export default specialtiesReducer
