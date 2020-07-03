import teachersService from '../services/teachers'

const teacherDataReducer = (state = {}, action) => {
	switch (action.type) {
	case 'GET_TEACHER_DATA': {
		return action.data
	}
	case 'UPDATE_TEACHER': {
		return action.data
	}
	default:
		return state
	}
}

/**
 * Get single teacher data
 * @param {string} id - Id of the teacher
 */
export const getTeacherData = id => {
	return async dispatch => {
		const teacher = await teachersService.getById(id)
		dispatch ({
			type: 'GET_TEACHER_DATA',
			data: teacher
		})
	}
}

/**
 * Update teacher data
 * @param {string} id - Id of the teacher to update
 * @param {Object} payload - Teacher's data
 * @param {Object} payload.name - Teacher's unique name
 */

export const updateTeacherData = (id, payload) => {
	return async dispatch => {
		const updatedTeacher = await teachersService.updateSingle(id, payload)
		dispatch ({
			type: 'UPDATE_TEACHER',
			data: updatedTeacher
		})
	}
}

export default teacherDataReducer
