import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/school`

/**
 * Get all current school stats
 *
 * @returns {Object} - Response data
 */
const getAll = async () => {
	try {
		const response = await axios.get(baseUrl) // make it post
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

export default { getAll }
