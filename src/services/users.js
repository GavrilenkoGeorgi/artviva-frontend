import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/users`

let token = null

/**
* Set user auth token
* @param {string} newToken Current user auth token
*/

// eslint-disable-next-line
const setToken = newToken => {
	token = `Bearer ${newToken}`
}

/**
* Get the list of all users
*
* @returns {Object} - Response data
*/

const getAll = async () => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.get(baseUrl, config)
	return response.data
}

/**
* Signup new user
* @param {Object} data - User account data
* @param {string} data.name - User name
* @param {string} data.middlename - User middle name
* @param {string} data.lastname - User last name
* @param {string} data.password - User password
*
* @returns {Object} - Response data
*/

const signUp = async data => {
	const response = await axios.post(baseUrl, data)
	return response.data
}

/**
* Activate user account
* @param {Object} data - User account data
* @param {string} data.email - User email
* @param {string} data.activationToken - User UUIDv4 activation token
*
* @returns {Object} - Response data
*/

const activate = async data => {
	const response = await axios.post(`${baseUrl}/activate`, data)
	return response.data
}

/**
* Update user details
* @param {Object} payload - User details
* @param {string} payload.name - User name
* @param {string} payload.middlename - User middle name
* @param {string} payload.lastname - User last name
* @param {string} payload.approvedUser - User account 'approved' status
* @param {string} payload.superUser - User account 'super user' status
*
* @returns {Object} - Response data
*/

const update = async (id, payload) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.put(`${baseUrl}/${id}`, payload, config)
	return response.data
}

/**
 * Delete single user
 *
 * @param {string} id - User ID
 *
 * @returns {Object} - Response data
 */

const deleteById = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.delete(`${baseUrl}/${id}`, config)
	return response.data
}

export default { getAll, signUp, setToken, activate, update, deleteById }
