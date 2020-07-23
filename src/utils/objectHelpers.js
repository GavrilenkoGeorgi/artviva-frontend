/**
* Trim spaces from object keys and values
* @param {object} obj - Object with data
*
* @return {object} - Object with key/value pair trimmed of spaces
*/

const trimObject = obj => {
	if (obj === null && !Array.isArray(obj) && typeof obj !== 'object') return obj
	return Object.keys(obj).reduce((acc, key) => {
		acc[key.trim()] = typeof obj[key] === 'string' ?
			obj[key].trim() : typeof obj[key] === 'object' ? trimObject(obj[key]) : obj[key]
		return acc
	}, Array.isArray(obj)? []:{})
}

/**
* Check if object is empty
* @param {Object} obj - Object to check
*
* @returns {boolean} - True if object exists, false otherwise
*/
const pureObjectIsEmpty = obj => obj && obj.constructor === Object && Object.keys(obj).length === 0

const removeFalsyProps = obj => {
	for (let key in obj) {
		const falsyValues = ['0', '']
		if (falsyValues.includes(obj[key])) {
			delete obj[key]
		}
	}
	return obj
}


export { trimObject, pureObjectIsEmpty, removeFalsyProps }
