import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/teachers`

let token = null

/**
 * Set user auth token
 * @param {string} newToken Current user auth token
 */

const setToken = newToken => {
	token = `bearer ${newToken}`
}

/**
 * Get list of all teachers
 *
 * @returns {Object} - Response data
 */
const getAll = async () => {
	try {
		const response = await axios.get(baseUrl)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Create new teacher
 * @param {Object} payload - New specialty data
 * @param {string} payload.name - Unique teacher name /? really
 *
 * @returns {Object} - Response data
 */
const create = async payload => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.post(baseUrl, payload, config)
	return response.data
}

/**
 * Delete single teacher
 * @param {string} id - Teacher ID
 *
 * @returns {Object} - Response data
 */

const deleteById = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const request = axios.delete(`${baseUrl}/${id}`, config)
	return request.then(response => response.data)
}

/**
 * Update teacher's data
 * @param {string} id - Teacher's id
 * @param {Object} payload - Updated teacher's data
 * @param {string} payload.name - Unique teacher's name
 *
 * @returns {Object} - Response data
 */

const update = async (id, payload) => {
	const config = {
		headers: { Authorization: token }
	}
	const request = axios.put(`${baseUrl}/${id}`, payload, config)
	return request.then(response => response.data)
}

/**
 * Update single teacher's data
 * @param {string} id - Teacher's id
 * @param {Object} payload - Updated teacher's data
 * @param {string} payload.name - Unique teacher's name
 *
 * @returns {Object} - Response data
 */

const updateSingle = async (id, payload) => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.put(`${baseUrl}/${id}`, payload, config)
	return response.data
}

/**
 * Get single teacher details by id
 * @param {string} id - Teacher ID
 *
 * @returns {Object} - Response data
 */

const getById = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.post(`${baseUrl}/${id}`, null, config)
	return response.data
}

export default { getAll, setToken, create, deleteById, update, getById, updateSingle }
