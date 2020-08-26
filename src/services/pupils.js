import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/pupils`

let token = null

/**
 * Set user auth token
 * @param {string} newToken Current user auth token
 */

const setToken = newToken => {
	token = `bearer ${newToken}`
}

/**
 * Get list of all pupils
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
 * Get list of teacher groups by id
 * @param {string} id - Group ID
 *
 * @returns {Array} - Array of object containing group data
 */

const getUserPupils = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const response = await axios.get(`${baseUrl}/user/${id}`, config)
	return response.data
}

/**
 * Create new pupil
 *
 * @param {Object} payload - New pupil data
 * @param {string} payload.name - Unique pupil's name
 * @param {string} payload.applicantName - Name of the person responsible for the pupil application
 * @param {string} payload.specialty - Pupil's specialty id
 * @param {string} payload.dateOfBirth - Pupil's date of birth
 * @param {string} payload.mainSchool - Current pupil's school
 * @param {integer} payload.mainSchoolClass - Current school form
 * @param {string} payload.gender - Pupil's gender
 * @param {integer} payload.hasBenefit - Benefits percent from 0-100
 * @param {string} payload.fathersName - Pupil's father's name
 * @param {string} payload.fathersPhone - Pupil's father's phone number
 * @param {string} payload.fathersEmploymentInfo - Pupil's father's job description
 * @param {string} payload.mothersName - Mother's name
 * @param {string} payload.mothersPhone - Mother's phone
 * @param {string} payload.mothersEmploymentInfo - Mother's job
 * @param {string} payload.contactEmail - Applicant's contact email
 * @param {string} payload.homeAddress - Pupil's home address
 * @param {string} payload.info - Some optional pupil info
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
 * Delete single pupil
 *
 * @param {string} id - Pupil ID
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
 * Get single pupil details by id
 *
 * @param {string} id - Pupil ID
 *
 * @returns {Object} - Response data
 */

const pupilDetailsById = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const request = axios.get(`${baseUrl}/${id}`, config)
	return request.then(response => response.data)
}

/**
 * Get pupil f1-form by id
 *
 * @param {string} id - Pupil ID
 *
 * @returns {Object} - Response data
 */

const pupilF1FormData = async id => {
	const config = {
		headers: { Authorization: token }
	}
	const request = axios.get(`${baseUrl}/f1/${id}`, config)
	return request.then(response => response.data)
}

/**
 * Update pupil's data
 *
 * @param {string} id - Pupil's id
 * @param {Object} payload - New pupil data
 * @param {string} payload.name - Unique pupil's name
 * @param {string} payload.currentlyEnrolled - Current pupil's status
 * @param {string} payload.applicantName - Name of the person responsible for the pupil application
 * @param {string} payload.specialty - Pupil's specialty id
 * @param {string} payload.dateOfBirth - Pupil's date of birth
 * @param {string} payload.mainSchool - Current pupil's school
 * @param {integer} payload.mainSchoolClass - Current school form
 * @param {string} payload.gender - Pupil's gender
 * @param {integer} payload.hasBenefit - Benefits percent from 0-100
 * @param {string} payload.fathersName - Pupil's father's name
 * @param {string} payload.fathersPhone - Pupil's father's phone number
 * @param {string} payload.fathersEmploymentInfo - Pupil's father's job description
 * @param {string} payload.mothersName - Mother's name
 * @param {string} payload.mothersPhone - Mother's phone
 * @param {string} payload.mothersEmploymentInfo - Mother's job
 * @param {string} payload.contactEmail - Applicant's contact email
 * @param {string} payload.homeAddress - Pupil's home address
 * @param {string} payload.info - Some optional pupil info
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
 * Process pupil public application form
 * without auth token
 *
 * @param {Object} payload - New pupil data
 * @param {string} payload.name - Unique pupil's name
 * @param {string} payload.applicantName - Name of the person responsible for the pupil application
 * @param {string} payload.specialty - Pupil's specialty id
 * @param {string} payload.dateOfBirth - Pupil's date of birth
 * @param {string} payload.mainSchool - Current pupil's school
 * @param {integer} payload.mainSchoolClass - Current school form
 * @param {string} payload.gender - Pupil's gender
 * @param {integer} payload.hasBenefit - Benefits percent from 0-100
 * @param {string} payload.fathersName - Pupil's father's name
 * @param {string} payload.fathersPhone - Pupil's father's phone number
 * @param {string} payload.fathersEmploymentInfo - Pupil's father's job description
 * @param {string} payload.mothersName - Mother's name
 * @param {string} payload.mothersPhone - Mother's phone
 * @param {string} payload.mothersEmploymentInfo - Mother's job
 * @param {string} payload.contactEmail - Applicant's contact email
 * @param {string} payload.homeAddress - Pupil's home address
 * @param {string} payload.info - Some optional pupil info
 *
 * @returns {Object} - Response data
 */

const publicApply = async payload => {
	const response = await axios.post(`${baseUrl}/apply`, payload)
	return response.data
}

export default {
	getAll, getUserPupils, pupilDetailsById,
	pupilF1FormData, setToken, create,
	deleteById, update, publicApply }
