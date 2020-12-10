import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/login`

/**
* Login existing user
* @param {Object} data - Data for the user login
* @param {string} data.email - User email
* @param {string} data.password - User password
*
* @returns {Object} - Response data
*/

const login = async data => {
	const response = await axios.post(baseUrl, data)
	return response.data
}

const refresh = async id => {
	const response = await axios.post(`${baseUrl}/refresh/${id}`)
	return response.data
}

export default { login, refresh }
