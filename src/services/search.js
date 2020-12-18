import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/search`

/**
 * Search teachers
 * @param {string} payload - Search term
 *
 * @returns {Object} - Response data
 */
const teachers = async payload => {

	try {
		const response = await axios.post(`${baseUrl}/teachers`, payload)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Search users
 * @param {string} payload - Search term
 *
 * @returns {Object} - Response data
 */
const users = async payload => {
	try {
		const response = await axios.post(`${baseUrl}/users`, payload)
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
	try {
		const response = await axios.post(`${baseUrl}/pupils`, payload)
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
	try {
		const response = await axios.post(`${baseUrl}/specialties`, payload)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Get teacher name by id
 * @param {string} id - Id of the teacher
 *
 * @returns {Object} - Response data
 */
const teacherNameById = async id => {
	try {
		const response = await axios.get(`${baseUrl}/teachers/name/${id}`)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Get email by id
 * @param {string} id - Id of the user
 *
 * @returns {Object} - Response data
 */
const userEmailById = async id => {
	try {
		const response = await axios.get(`${baseUrl}/users/email/${id}`)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Get full user name by lastname fulltext search
 * @param {Object} payload
 * @param {string} payload.value - Part of the lastname string to search
 *
 * @returns {Object} - Response data
 */
const fullUserNameSearch = async payload => {

	try {
		const response = await axios.post(`${baseUrl}/users/lastname`, payload)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Get user ID by email
 * @param {Object} payload
 * @param {string} payload.email - User email to search
 *
 * @returns {Object} - Response data
 */
const getIdByEmail = async payload => {
	try {
		const response = await axios.post(`${baseUrl}/users/idbyemail`, payload)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

export default {
	pupils,
	teachers,
	users,
	specialties,
	teacherNameById,
	userEmailById,
	fullUserNameSearch,
	getIdByEmail
}
