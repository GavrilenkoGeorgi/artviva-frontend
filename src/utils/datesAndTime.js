import moment from 'moment'
import 'moment-precise-range-plugin'

export const toHumanReadable = (locale, seconds) => {
	return new Date(seconds).toLocaleString(locale, { dateStyle: 'long', timeStyle: 'short' })
}

export const minDate = months => {
	let minDate = new Date()
	minDate.setMonth(minDate.getMonth() - months)
	return minDate
}

export const maxDate = months => {
	let maxDate = new Date()
	maxDate.setMonth(maxDate.getMonth() + months)
	return maxDate
}

export const schoolYearMonths = () => {

	// check if date is in summer
	/* const isSummer = date => {
		const summerMonths = [5, 6, 7]
		if (summerMonths.includes(date.getMonth())) {
			return true
		}
		return false
	} */

	// how many months left till the end of the school year
	/* 	const monthsTillSummer = month => {
		const studyMonths = 9
		if (month > 8) {
			return (studyMonths - month) + studyMonths
		} else {
			return (studyMonths - month) - 3 // months of the summer
		}
	} */

	// get array of period months based on the current and ending month
	/* const getPeriodMonths = (currentMonth, endingMonth) => {
		// https://stackoverflow.com/questions/23976513/javascript-setmonth-shows-improper-date
		const current = new Date()
		const date = new Date(current.getFullYear(), currentMonth, 1) // so we set it to the first day of the month

		const result = []
		while (endingMonth !== currentMonth) {
			date.setMonth(endingMonth - 1)
			result.push(date.toLocaleString(locale, { month:'long' }))
			endingMonth--
		}
		return result.reverse()
	} */

	// finally

	const result = ['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень']

	return result
	/* const currentDate = new Date()
	let endingMonth

	if (currentDate.getMonth() === 8 || isSummer(currentDate)) { // september or summer
		return ['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень']
	} else { // not september nor summer, i.e. middle of the year
		endingMonth = (currentDate.getMonth() - 1) + monthsTillSummer(currentDate.getMonth())
		return getPeriodMonths(currentDate.getMonth(), endingMonth)
	} */
}

// returns user with calculated xp
export const calcEmployeeExperience = ({ id, employmentDate, experienceToDate }) => {
	const today = moment()
	const date = moment(employmentDate)
	const user = {
		id,
		result: {}
	}

	if (date.isBefore(today)) {
		// adjust date, add previous xp
		// to the current employment date
		for (let value in experienceToDate) {
			date.subtract(experienceToDate[value], value)
		}
		const result = moment.preciseDiff(date, today, true)
		return ({ ...user, result })
	} else {
		return ({ ...user, result: experienceToDate })
	}
}

/**
 * Sort list of months in given locale
 *
 * @param {string} - Locale string
 * @param {Array} - List of months to sort
 *
 * @return {Array} - Array of months
 */

export const sortMonthsNames = (data, locale) => {

	// https://github.com/nodejs/node/issues/8500
	// hence this two arrays with months names
	// eslint-disable-next-line
	const uaMonths = ['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень']
	// eslint-disable-next-line
	const ruMonths = ['сентябрь', 'октябрь', 'ноябрь', 'декабрь', 'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август']

	let listOfAllMonths

	switch (locale) {
	case 'uk-UA':
		listOfAllMonths = uaMonths
		break
	case 'ru-RU':
		listOfAllMonths = ruMonths
		break
	default: // default to ua
		listOfAllMonths = uaMonths
	}
	return data.sort((a, b) => listOfAllMonths.indexOf(a) - listOfAllMonths.indexOf(b))
}
