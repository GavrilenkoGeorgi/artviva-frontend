import userReducer from '../../reducers/userReducer'
import usersList from '../../__mocks__/usersList'

describe('Users reducer', () => {
	test('returns default state', () => {
		const defaultState = userReducer(undefined, {})
		expect(defaultState).toEqual(null)
	})

	test('returns users list', () => {
		const usersListState = userReducer(undefined, {
			type: 'GET_USERS_LIST',
			data: usersList
		})

		expect(usersListState).toHaveLength(2)
	})

	test('updates user details', () => {
		const [ firstUser ] = usersList
		const updatedState = userReducer(usersList, {
			type: 'UPDATE_USER_DETAILS',
			data: { ...firstUser, middlename: 'Updated' }
		})
		const [ updatedUser ] = updatedState

		expect(updatedUser.middlename).toEqual('Updated')
		expect(updatedUser.id).toEqual(firstUser.id)
	})

	test('deletes user', () => {
		const [ userToDelete, userToKeep ] = usersList
		const newState = userReducer(usersList, {
			type: 'DELETE_USER',
			data: userToDelete.id
		})

		expect(newState).toHaveLength(1)
		expect(newState).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining(userToDelete)
			])
		)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(userToKeep)
			])
		)
	})

})
