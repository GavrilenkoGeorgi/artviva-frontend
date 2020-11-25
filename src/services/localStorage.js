// use this!
const setStoredUser = (user) => window.localStorage.setItem('user', JSON.stringify(user))
const getStoredUser = () => JSON.parse(window.localStorage.getItem('user'))
const removeStoredUser = () => window.localStorage.removeItem('user')
const getUserJWTToken = () => {
	const userData = JSON.parse(window.localStorage.getItem('loggedUserJSON'))
	if (userData) return userData.token
	else return ''
}

export { getStoredUser, setStoredUser, removeStoredUser, getUserJWTToken }
