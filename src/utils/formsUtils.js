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
