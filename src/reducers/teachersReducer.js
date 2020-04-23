import teachersService from '../services/teachers'

const teachersReducer = (state = [], action) => {
	switch (action.type) {
	case 'CREATE_TEACHER':
		return [...state, action.data]
	case 'DELETE_TEACHER':
		return state.filter(teacher => teacher.id !== action.data)
	case 'INIT_TEACHERS':
		return action.data
	case 'UPDATE_TEACHER': {
		const updatedTeacher= action.data
		return state.map(teacher =>
			teacher.id !== action.data.id ? teacher : updatedTeacher
		)
	}
	default:
		return state
	}
}

/**
 * Create new teacher
 * @param {Object} payload - New teacher data
 * @param {string} payload.name - Unique teacher name
 */
export const createTeacher = payload => {
	return async dispatch => {
		const newTeacher = await teachersService.create(payload)
		dispatch ({
			type: 'CREATE_TEACHER',
			data: newTeacher
		})
	}
}

/**
 * Initialise teachers
 */
export const initializeTeachers = () => {
	return async dispatch => {
		const teachers = await teachersService.getAll()
		dispatch ({
			type: 'INIT_TEACHERS',
			data: teachers
		})
	}
}

/**
 * Delete single teacher
 * @param {string} id - Id of the teacher to delete
 */
export const deleteTeacher = id => {
	return async dispatch => {
		await teachersService.deleteById(id)
		dispatch ({
			type: 'DELETE_TEACHER',
			data: id
		})
	}
}

/**
 * Update teacher data
 * @param {string} id - Id of the teacher to update
 * @param {Object} payload - Teacher's data
 * @param {Object} payload.name - Teacher's unique name
 */

export const updateTeacher = (id, payload) => {
	return async dispatch => {
		const updatedTeacher = await teachersService.update(id, payload)
		dispatch ({
			type: 'UPDATE_TEACHER',
			data: updatedTeacher
		})
	}
}

export default teachersReducer
