import schoolClassesService from '../services/schoolClasses'

const schoolClassesReducer = (state = [], action) => {
	switch (action.type) {
	case 'CREATE_SCHOOL_CLASS':
		return [...state, action.data]
	case 'DELETE_SCHOOL_CLASS':
		return state.filter(schoolClass => schoolClass.id !== action.data)
	case 'INIT_SCHOOL_CLASSES':
		return action.data
	case 'UPDATE_SCHOOL_CLASS': {
		const updatedSchoolClass = action.data
		return state.map(schoolClass =>
			schoolClass.id !== action.data.id ? schoolClass : updatedSchoolClass
		)
	}
	default:
		return state
	}
}

/**
 * Create new class
 * @param {Object} payload - New school class data
 * @param {string} payload.title - Unique class title
 * @param {string} payload.info - Some optional class descr
 * @param {string} payload.teacher - Class teacher
 * @param {string} payload.specialty - Class specialty
 * @param {array} payload.pupils - Array of class pupils
 *
 */
export const createSchoolClass = payload => {
	return async dispatch => {
		const newSchoolClass = await schoolClassesService.create(payload)
		dispatch ({
			type: 'CREATE_SCHOOL_CLASS',
			data: newSchoolClass
		})
	}
}

/**
 * Initialise school classes
 */
export const initializeSchoolClasses = () => {
	return async dispatch => {
		const schoolClasses = await schoolClassesService.getAll()
		dispatch ({
			type: 'INIT_SCHOOL_CLASSES',
			data: schoolClasses
		})
	}
}

/**
 * Initialise teacher groups list
 * @param {string} id - Id of the teacher
 *
 * @returns {Array} - Array of objects containing group info
 */
export const getGroups = (access, id) => {
	return async dispatch => {
		let groups = []
		if (access) {
			groups = await schoolClassesService.getAll()
		} else if (id) {
			groups = await schoolClassesService.getTeacherGroups(id)
		}
		dispatch ({
			// sets still not renamed 'school classes' list
			type: 'INIT_SCHOOL_CLASSES',
			data: groups
		})
	}
}

/**
 * Delete single school class
 * @param {string} id - Id of the school class to delete
 */

export const deleteSchoolClass = id => {
	return async dispatch => {
		await schoolClassesService.deleteById(id)
		dispatch ({
			type: 'DELETE_SCHOOL_CLASS',
			data: id
		})
	}
}

/**
 * Update school class details
 * @param {string} id - Id of the school class to update
 * @param {Object} schoolClass - Schol class to update
 */

export const updateSchoolClass = (id, schoolClass) => {
	return async dispatch => {
		const updatedSchoolClass = await schoolClassesService.update(id, schoolClass)
		dispatch ({
			type: 'UPDATE_SCHOOL_CLASS',
			data: updatedSchoolClass
		})
	}
}

export default schoolClassesReducer
