/**
 * Compare two values. Helper for the sort function.
 *
 * @param {string} key - Name of the key to compare
 * @param {string} order - Order by which to sort
 *
 * @returns result of comparison
 */

export const compareValues = (key, order = 'asc') => {
	return function innerSort(a, b) {
		if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) {
			// property doesn't exist on either object
			return 0
		}

		const varA = (typeof a[key] === 'string')
			? a[key].toUpperCase() : a[key]
		const varB = (typeof b[key] === 'string')
			? b[key].toUpperCase() : b[key]

		let comparison = 0
		if (varA > varB) {
			comparison = 1
		} else if (varA < varB) {
			comparison = -1
		}
		return (
			(order === 'desc') ? (comparison * -1) : comparison
		)
	}
}

/**
 * Sort array of objects by nested property
 * @param {string} prop1 - Property to sort
 * @param {string} prop2 - Optional nested property
 * @param {string} direction - Sort order
 *
 * @return {array} Sorted array
 */

export const nestedSort = (prop1, prop2 = null, direction = 'asc') => (e1, e2) => {
	const a = prop2 ? e1[prop1][prop2] : e1[prop1],
		b = prop2 ? e2[prop1][prop2] : e2[prop1],
		sortOrder = direction === 'asc' ? 1 : -1
	return (a < b) ? -sortOrder : (a > b) ? sortOrder : 0
}


/**
 * Find object in array by property value
 * @param {string} value - Value to search
 * @param {string} field - Name of the field to search for given value
 * @param {array} data - Array of objects
 *
 * @return {object} - Resulting object
 */

export const findByPropertyValue =
	(value, field, data) => data.find(item => item[field] === value)

/**
 * Filter array of objects by proprety value
 * @param {Object[]} products - Array of objects
 * @param {Object} filters - Filters
 *
 * @returns {Object[]} - Filterd array of objects
 */
export const multiPropsFilter = (products, filters) => {
	const filterKeys = Object.keys(filters)
	return products.filter(product => {
		return filterKeys.every(key => {
			if (!filters[key].length) return true
			// Loops again if product[key] is an array (for material attribute).
			if (Array.isArray(product[key])) {
				return product[key].some(keyEle => filters[key].includes(keyEle))
			}
			return filters[key].includes(product[key])
		})
	})
}

/**
 * Filter array of objects by bool property
 *
 * @param {Object[]} products - Array of objects
 * @param {Object} filters - Set of filters
 *
 * @returns {Object[]} - filtered array of objects
 */

export const boolPropsFilter = (products, filters) => {
	const filterKeys = Object.keys(filters)
	return products.filter(product => {
		return filterKeys.every(key => {
			return filters[key] === product[key]
		})
	})
}

/**
 * Creates hashtags from the facebook post data
 * also removes them from the message body
 *
 * @param {Object[]} array - Array of posts
 *
 * @returns {Object[]} - Sorted and filtered data, hastags applied to each post
 */

export const getHashtagsAndURLs = array => {
	// create hashtags
	array.map(post => {
		const hashtags = post.message.match(/#[\p{L}]+/ugi) || []
		// eslint-disable-next-line
		const urls = post.message.match(/([a-z0-9-]+\:\/+)([^\/\s]+)([a-z0-9\-@\^=%&;\/~\+]*)[\?]?([^ \#\r\n]*)#?([^ \#\r\n]*)/mig) || []

		post.hashtags = hashtags
		post.urls = urls

		const tagsAndUrls = [ ...hashtags, ...urls ]
		if (tagsAndUrls) {
			let message
			for (let item of tagsAndUrls) {
				message = post.message.replace(item, '')
				post.message = message.trim()
			}
		}
	})

	return array
}

/**
 * Parses youtube links from post's text blob
 *
 * @param {Object[]} array - Array of posts
 *
 * @returns {Object[]} - Sorted and filtered data, hastags applied to each post
 */

export const parseYtLinks = array => {
	array.map(post => {
		// eslint-disable-next-line
		let ytLinkPattern = /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)(\?[_0-9a-z-]+=[_0-9a-z-]+)?/i
		const id = post.message?.match(ytLinkPattern)
		if (id) {
			const message = post.message.replace(ytLinkPattern, '')
			post.message = message
			post.ytId = id[8]
		}
	})
	return array
}
