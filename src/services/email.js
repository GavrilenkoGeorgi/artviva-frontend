import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/email`

/**
* Send contact form message
* @param {Object} payload User name, email address and message
*/

const sendContactEmail = async payload => {
	const response = await axios.post(`${baseUrl}/contact`, payload)
	return response.data
}

export default { sendContactEmail }