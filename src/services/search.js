import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/search`

let token = null

/**
 * Set user auth token
 * @param {string} newToken Current user auth token
 */

const setToken = newToken => {
	token = `bearer ${newToken}`
}

/**
 * Search teachers
 * @param {string} payload - Search term
 *
 * @returns {Object} - Response data
 */
const teachers = async payload => {

	const config = {
		headers: { Authorization: token }
	}

	try {
		const response = await axios.post(`${baseUrl}/teachers`, payload, config)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Search pupils
 * @param {string} payload - Search term
 *
 * @returns {Object} - Response data
 */
const pupils = async payload => {

	const config = {
		headers: { Authorization: token }
	}

	try {
		const response = await axios.post(`${baseUrl}/pupils`, payload, config)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Search specialties
 * @param {string} payload - Search term
 *
 * @returns {Object} - Response data
 */
const specialties = async payload => {

	const config = {
		headers: { Authorization: token }
	}

	try {
		const response = await axios.post(`${baseUrl}/specialties`, payload, config)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Search specialties
 * @param {string} payload - Search term
 *
 * @returns {Object} - Response data
 */
const teacherNameById = async id => {

	const config = {
		headers: { Authorization: token }
	}

	try {
		const response = await axios.get(`${baseUrl}/teachers/name/${id}`, config)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

export default { pupils, teachers, teacherNameById, specialties, setToken }
