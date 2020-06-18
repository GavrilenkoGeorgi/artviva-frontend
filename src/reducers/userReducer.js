import userService from '../services/users'

const usersReducer = (state = null, action) => {
	switch (action.type) {
	case 'GET_USERS_LIST':
		return action.data
	case 'UPDATE_USER_DETAILS': {
		return state.map(user =>
			user.id !== action.data.id ? user : action.data
		)
	}
	case 'GET_USER_BY_ID': //???
		return action.data
	default:
		return state
	}
}

/**
 * Get list of all users
 */

export const getUsersList = () => {
	return async dispatch => {
		const users = await userService.getAll()
		dispatch ({
			type: 'GET_USERS_LIST',
			data: users
		})
	}
}

/**
 * Update user data
 * @param {string} id - Id of the user to update
 * @param {Object} payload - Users's data
 * @param {Object} payload.name - User's name
 * @param {Object} payload.middlename - User's middlename
 * @param {Object} payload.lastname - User's lastname
 * @param {string} data.approvedUser - User account 'approved' status
 * @param {string} data.superUser - User account 'super user' status
 */

export const updateUser = (id, payload) => {
	return async dispatch => {
		const { updatedUser } = await userService.update(id, payload)
		dispatch ({
			type: 'UPDATE_USER_DETAILS',
			data: updatedUser
		})
	}
}

export default usersReducer
