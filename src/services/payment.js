import axios from 'axios'
const baseUrl = `${process.env.REACT_APP_API_URL}/api/payment`

/**
* Get data for the payment form
* @param {Object} data - Data for the form
* @param {string} data.action - Payment type
* @param {string} data.amount - Payment amount
* @param {string} data.currency - Payment currency
* @param {string} data.description - Payment description
* @param {string} data.order_id - Payment order id
* @param {string} data.version - Liqpay API version
*
* @returns {Object} - Response data
*/

const form = async data => {
	const response = await axios.post(`${baseUrl}/form`, data)
	return response.data
}

/**
* Get list of all payments
*
* @returns {Object} - Response data
*/

const getAll = async () => {
	const response = await axios.get(`${baseUrl}/list`)
	return response.data
}

/**
* Update payment description
*
* @returns {Object} - Response data
*/

const updateDescr = async (id, values) => {
	const response = await axios.patch(`${baseUrl}/descr/${id}`, values)
	return response.data
}

/**
* Get payments from liqpay server
*
* @param {object} range - Data date range to get
* @param {string} range.date_from - Start date
* @param {string} range.date_to - End date
*
* @returns {Object} - Response data
*/

const getLiqPayResults = async range => {
	const response = await axios.post(`${baseUrl}/reports`, range)
	return response.data
}


export default { form, getAll, updateDescr, getLiqPayResults }
