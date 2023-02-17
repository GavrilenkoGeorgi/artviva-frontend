import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/specialties`

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
		console.log(error)
	}
}

/**
 * Get list of all specialties with current prices
 *
 * @returns {Object} - Response data
 */
const getPrices = async () => {
	try {
		const response = await axios.get(`${baseUrl}/prices`)
		return response.data
	} catch (error) {
		console.log(error)
	}
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
	const response = await axios.post(baseUrl, payload)
	return response.data
}

/**
 * Delete single specialty
 * @param {string} id - Specialty ID
 *
 * @returns {Object} - Response data
 */

const deleteById = async id => {
	const response = axios.delete(`${baseUrl}/${id}`)
	return response
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
	const request = axios.put(`${baseUrl}/${id}`, payload)
	return request.then(response => response.data)
}

export default { getAll, create, deleteById, update, getPrices }
