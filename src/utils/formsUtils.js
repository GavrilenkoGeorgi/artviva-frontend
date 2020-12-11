import moment from 'moment'
import 'moment-precise-range-plugin'
import { pureObjectIsEmpty } from './objectHelpers'

/**
 * Check if employee is full time employee
 *
 * @param {string} type - Type of employee
 *
 * @returns {boolean} - True if fulltime employee, false otherwise
 */

export const fullTimeEmployee = type => type === 'Штатний співробітник' ? true : false

/**
 * Parse integer or return zero
 *
 * @param {string} value - Value to parse
 *
 * @returns {number} - Parsed number
 */

export const parseIntegerValue = value => {
	return parseInt(value) || 0
}

/**
 * Calculate teacher experience
 *
 * @param {Object} currentTeacherExperience - Experience data object
 * @param {number} currentTeacherExperience.years - Number of years
 * @param {number} currentTeacherExperience.months - Number of months
 * @param {number} currentTeacherExperience.days - Number of days
 * @param {string} employmentDate - ISO-8601 date
 * @param {*} today - ISO-8601 date
 *
 * @returns {Object} Object with calculated experience to the current date
 */

export const currentExperience = (currentTeacherExperience, employmentDate, today) => {
	const xpToday = moment.preciseDiff(employmentDate, today, true)
	const xpToSet = {
		years: currentTeacherExperience.years + xpToday.years,
		months: currentTeacherExperience.months + xpToday.months,
		days: currentTeacherExperience.days + xpToday.days
	}
	return xpToSet
}

/**
 * Calculate percent of a number.
 *
 * @param {float|int} percent The percent value that you want to get.
 * @param {float|int} num The number that you want to calculate the percent of.
 *
 * @throws Will throw an error if there is no result to return
 *
 * @returns {Number}
 */
export const calculatePercent = (percent, num) => {
	const result = (percent / 100) * num

	if (!result || isNaN(result))
		throw new Error('Can\'t calculate percent for given data.')

	return result
}

/**
 * Prepare select field choices from json file
 * to use in validation schema
 *
 * @param {Object[]} items - a list of literal select options objects
 * @param {string} items[].field - input field name
 * @param {string} items[].label - input field label
 * @param {array} items[].choices - array of available choices
 *
 * @throws Will throw an error if the argument is an empty array
 *
 * @returns {Object} - Object to use in validation schema
 */

export const fieldChoices = (items) => {
	const result = {}
	for (let item of items) {
		const { field, choices } = item
		result[field] = choices
	}
	if (pureObjectIsEmpty(result))
		throw new Error('Field choices object for validation schema is empty.')
	return result
}

/**
 * Calculate teacher experience from user input
 *
 * @param {Object} field - Form field data
 * @param {string} field.name - Form field name
 * @param {string} field.value - Form field value
 * @param {Object} data - Current experince values
 * @param {string} data.employmentDate - Teacher employment date
 * @param {string} data.years - Form "years" input value
 * @param {string} data.months - Form "months" input value
 * @param {string} data.days - Form "days" input value
 *
 * @throws - Error if calculation was unsuccessful
 *
 * @returns {Object} Object with calculated experience
 */

export const calcEmployeeExperience = (field, data) => {
	const today = moment()
	let emplDate = null

	const userInputData = {
		years: parseIntegerValue(data.years),
		months: parseIntegerValue(data.months),
		days: parseIntegerValue(data.days)
	}

	if (field.name === 'employmentDate') {
		emplDate = moment(field.value)
	} else {
		emplDate = moment(data.employmentDate)
	}

	if (emplDate.isBefore(today)) {
		// adjust data to user input
		for (let value in userInputData) {
			emplDate.subtract(userInputData[value], value)
		}
		const result = moment.preciseDiff(emplDate, today, true)

		if (isNaN(result.years)) {
			throw new Error('Can\'t calculate experience.')
		} else return result || userInputData
	}
}

/**
 * Prepare object with field choices list
 *
 * @param {Object[]} selectDataObjects - Array of objects containing field data
 *
 * @returns {Object} - Object with property names that correspond to field names
 * with array of avaliable choices
 */

export const prepareSelectData = selectDataObjects => {
	const result = {}
	for (let item of selectDataObjects) {
		result[item.field] = item.choices
	}
	return result
}

/**
 * Filter user input to allow only digits
 *
 * @returns {Array} Array of aloowed key codes
 */

export const phoneInputFilter = () => {
	const filter = []

	// since we're looking for phone numbers, we need
	// to allow digits 0 - 9 (they can come from either
	// the numeric keys or the numpad)
	const keypadZero = 48
	const numpadZero = 96

	// add key codes for digits 0 - 9 into this filter
	for (let i = 0; i <= 9; i++) {
		filter.push(i + keypadZero)
		filter.push(i + numpadZero)
	}

	return filter
}

/**
 * Format user input based on the template
 * @param {string} string - User input
 * @throws Will throw error if input isn't a string
 *
 * @returns {string} formatted phone number string
 */

export const formatPhoneNumber = string => {
	if (typeof string !== 'string')
		throw new Error('Input must be a string.')

	const chars = string.split('')

	let numbers
	if (string.startsWith('+', 0)) {
		const parsedIntegers = chars.map(char => parseInt(char, 10))
		const onlyNumbers = parsedIntegers.filter(number => number >= 0)
		// remove prefix numbers '38'
		numbers = onlyNumbers.splice(2, onlyNumbers.length)
	} else {
		numbers = chars
	}

	let template = '(___) ___-__-__'
	let placeholder = '_'

	for (let char of numbers) {
		const firstPlaceholder = template.indexOf(placeholder)
		if (firstPlaceholder > 0) {
			const firstPart = template.substr(0, firstPlaceholder)
			const latterPart = template.substr(firstPlaceholder + 1, template.length)
			template = firstPart + char + latterPart
		}
	}
	return `+38 ${template}`
}

/**
 * Set formatted phone input value
 *
 * @param {Object} event - User input event
 * @callback setFieldValue - Formik function to set field value
 */

export const setPhoneInputFieldValue = (event, setFieldValue) => {
	const { target } = event
	const filter = phoneInputFilter()

	if (filter.indexOf(event.keyCode) < 0) {
		event.preventDefault()
	} else {
		const result = formatPhoneNumber(target.value)
		setFieldValue(target.name, result)
	}
}
