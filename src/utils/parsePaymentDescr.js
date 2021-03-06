import { sortMonthsNames } from './datesAndTime'
/**
 * Get payment data object from payment description string
 * from liqpay
 * Description string goes like this:
 * `Оплата: лютий, березень, квітень.
 * Викладач: Hank Hill.
 * Учень: Bobby Hill.
 * Предмет: Саксофон.`
 * @param {string} descrStr - Payment description
 * @param {string} locale - Locale used for dates
 *
 * @throws Will throw an error if description string is missing or malformed
 *
 * @returns {object} - Payment data object
 */

const getPaymentDataFromString = (descrStr, locale) => {

	if (typeof descrStr !== 'string' || !descrStr.length)
		throw new Error('Payment description string is required.')

	const requiredMarkers = ['Оплата:', 'Викладач:', 'Учень:', 'Предмет:']

	for (let marker of requiredMarkers) {
		if (!descrStr.includes(marker))
			throw new Error(`Payment description string is malformed. Missing marker: ${marker}`)
	}

	// initial payment data
	let paymentData = {
		teacher: '',
		pupil: '',
		specialty: '',
		months: []
	}

	const getDataIdx = string => {
		const start = string.indexOf(':')
		const end = string.indexOf('.')
		return { start, end }
	}

	const extractString = (str, start, end ) => {
		return str.slice(start + 1, end).trim()
	}

	// index of months data
	const monthsIdx = getDataIdx(descrStr)
	// extract months string
	let months = extractString(descrStr, monthsIdx.start, monthsIdx.end)
	// split to array and sort
	months = sortMonthsNames(months.split(',').map(item => item.trim()), locale)
	// save to description
	paymentData.months = months

	// get teacher name
	let remainingData = descrStr.substr(monthsIdx.end + 1).trim()
	const teacherIdx = getDataIdx(remainingData)
	paymentData.teacher = extractString(remainingData, teacherIdx.start, teacherIdx.end)

	// get pupil name
	remainingData = remainingData.substr(teacherIdx.end + 1).trim()
	const pupilIdx = getDataIdx(remainingData)
	paymentData.pupil = extractString(remainingData, pupilIdx.start, pupilIdx.end)

	// get specialty title
	remainingData = remainingData.substr(pupilIdx.end + 1).trim()
	const specialtyIdx = getDataIdx(remainingData)
	paymentData.specialty = extractString(remainingData, specialtyIdx.start, specialtyIdx.end)

	return paymentData
}

export default getPaymentDataFromString
