/**
 * Substract percent from given amount
 *
 * @param {Number} amount Payment amount
 * @returns {Number}
 */
export const substractLiqPayPercent = amount => {
	// liqpay percent is 2.75
	const percent = 2.75
	const result = amount/100 * percent
	return amount - result
}
