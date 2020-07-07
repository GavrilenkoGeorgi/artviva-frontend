import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/schoolclasses`

let token = null

/**
 * Set user auth token
 * @param {string} newToken - Current user auth token
 */

const setToken = newToken => {
	token = `bearer ${newToken}`
}

/**
 * Get list of all classes
 *
 * @returns {Object} - Response data
 */
const getAll = async () => {
	const config = {
		headers: { Authorization: token }
	}
	try {
		const response = await axios.get(baseUrl, config)
		return response.data
	} catch (error) {
		return Promise.reject(error.response)
	}
}

/**
 * Get single school class details by id
 * @param {string} id - School class ID
 *
 * @returns {Object} - Response data
 */

const getById = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const request = axios.post(`${baseUrl}/${id}`, null, config)
	return request.then(response => response.data)
}

/**
 * Get list of teacher groups by id
 * @param {string} id - Group ID
 *
 * @returns {Array} - Array of object containing group data
 */

const getTeacherGroups = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.get(`${baseUrl}/teacher/${id}`, config)
	return response.data
}

/**
 * Create new school class
 * @param {Object} payload - New school class data
 * @param {string} payload.title - Unique class title
 * @param {string} payload.info - Some optional class descr
 * @param {string} payload.teacher - Class teacher
 * @param {string} payload.specialty - Class specialty
 * @param {string} payload.pupils - Array of class pupils
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
 * Delete single school class
 * @param {string} id - School class ID
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
 * Update school class data
 * @param {string} id - School class ID
 * @param {Object} payload - Updated school class data
 * @param {string} payload.title - Unique school class name
 * @param {string} payload.info - Some optional class descr
 * @param {string} payload.teacher - Class teacher
 * @param {string} payload.specialty - Class specialty
 * @param {string} payload.pupils - Array of class pupils
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

export default { getAll, getById, getTeacherGroups, setToken, create, deleteById, update }
