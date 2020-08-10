import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/specialties`

let token = null

/**
 * Set user auth token
 * @param {string} newToken Current user auth token
 */

const setToken = newToken => {
	token = `bearer ${newToken}`
}

/**
 * Get list of all specialties
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
 * Get list of all specialties with current prices
 *
 * @returns {Object} - Response data
 */
const getPrices = async () => {
	const response = await axios.get(`${baseUrl}/prices`)
	return response.data
}

/**
 * Create new specialty
 * @param {Object} payload - New specialty data
 * @param {string} payload.title - Unique specialty title
 * @param {string} payload.cost - Cost per month
 * @param {string} payload.info - Additional info
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
 * Delete single specialty
 * @param {string} id - Specialty ID
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
 * Update specialty
 * @param {string} id - Id of the specialty
 * @param {Object} payload - Updated specialty data
 * @param {string} payload.name - Unique specialty title
 * @param {string} payload.cost - Cost per month
 * @param {string} payload.info - Additional info
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

export default { getAll, setToken, create, deleteById, update, getPrices }
