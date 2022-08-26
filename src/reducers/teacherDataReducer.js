import teachersService from '../services/teachers'
import { substractLiqPayPercent } from '../utils/paymentsHelper'

const teacherDataReducer = (state = null, action) => {
	switch (action.type) {
	case 'GET_TEACHER_DATA': {
		return action.data
	}
	case 'UPDATE_TEACHER': {
		return action.data
	}
	case 'CREATE_TEACHER' : {
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
		// eslint-disable-next-line
		const teacher = await teachersService.getById(id)
		const minusPercent = teacher.payments.map(item => ({ ...item, amount: substractLiqPayPercent(item.amount) }))
		dispatch ({
			type: 'GET_TEACHER_DATA',
			data: { ...teacher, payments: minusPercent }
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

/**
 * Create new teacher linked to user account
 * @param {Object} payload - New teacher data
 * @param {string} payload.name - Unique teacher name
 */
export const createTeacherData = payload => {
	return async dispatch => {
		const newTeacher = await teachersService.create(payload)
		dispatch ({
			type: 'CREATE_TEACHER',
			data: newTeacher
		})
	}
}

export default teacherDataReducer
