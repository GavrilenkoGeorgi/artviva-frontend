import loginReducer from '../reducers/loginReducer'

const userLoginData = {
	// eslint-disable-next-line
	token: 'eyJhbGciOiJIUzI1NiIsInR4cCI6IkpXVCJ9.eyJlbWFpbCI6ImdhdnJpbGVua28uZ2VvcmdpQGdtYWlsLmNvbSIsImlkIjoiNWYwODQxYWI2ZjRmMmQwMDA0NjhhMDY3IiwiaWF0IjoxNjAyNzY3OTc2fQ.9-Lhuo0ns3EaLkfGsBhKDk6RKw4qYBjcI4UpTvH1Cko',
	name: 'Joe',
	middlename: 'Tester',
	lastname: 'Doe',
	email: 'joe@example.com',
	approvedUser: true,
	superUser: true,
	isActive: true,
	teacher: null,
	id: '5f0841ab9f4f2d000468a067'
}

describe('Login reducer', () => {
	test('returns default state', () => {
		const defaultState = loginReducer(undefined, {})
		expect(defaultState).toEqual(null)
	})

	test('correctly sets user data on login', () => {
		const loggedInState = loginReducer(undefined, {
			type: 'LOGIN',
			user: userLoginData
		})

		expect(loggedInState.email).toBe('joe@example.com')
	})

	test('correctly refreshes state on user data changes', () => {
		const refreshedState = loginReducer(undefined, {
			type: 'REFRESH_USER_DATA',
			user: userLoginData
		})

		expect(refreshedState.email).toBe('joe@example.com')
	})

	test('correctly sets user data from localstorage', () => {
		const restoredState = loginReducer(undefined, {
			type: 'SET_USER_FROM_LS',
			user: userLoginData
		})

		expect(restoredState.email).toBe('joe@example.com')
	})
})
