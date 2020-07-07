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

export const schoolYearMonths = locale => {

	// check if date is in summer
	const isSummer = date => {
		const summerMonths = [5, 6, 7]
		if (summerMonths.includes(date.getMonth())) {
			return true
		}
		return false
	}

	// how many months left till the end of the school year
	const monthsTillSummer = month => {
		const studyMonths = 9
		if (month > 8) {
			return (studyMonths - month) + studyMonths
		} else {
			return (studyMonths - month) - 3 // months of the summer
		}
	}

	// get array of period months based on the current and ending month
	const getPeriodMonths = (currentMonth, endingMonth) => {
		const date = new Date()
		const result = []
		while (endingMonth !== currentMonth) {
			date.setMonth(endingMonth - 1)
			result.push(date.toLocaleString(locale, { month:'long' }))
			endingMonth--
		}
		return result.reverse()
	}

	// finally
	const currentDate = new Date()
	let endingMonth

	if (currentDate.getMonth() === 8 || isSummer(currentDate)) { // september or summer
		return ['вересень', 'жовтень', 'листопад', 'грудень', 'січень', 'лютий', 'березень', 'квітень', 'травень']
	} else { // not september nor summer, i.e. middle of the year
		endingMonth = (currentDate.getMonth() - 1) + monthsTillSummer(currentDate.getMonth())
		return getPeriodMonths(currentDate.getMonth(), endingMonth)
	}
}
