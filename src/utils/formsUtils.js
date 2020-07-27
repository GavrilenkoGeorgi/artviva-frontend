import moment from 'moment'
import 'moment-precise-range-plugin'

export const fullTimeEmployee = type => type === 'Штатний співробітник' ? true : false

export const parseIntegerValue = value => {
	return parseInt(value) || 0
}
// and this
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
 * @param float percent The percent that you want to get.
 * @param float|int num The number that you want to calculate the percent of.
 * @returns {Number}
 */
export const calculatePercent = (percent, num) => {
	return (percent / 100) * num
}
