import paymentService from '../services/payment'

const liqPayDataReducer = (state = [], action) => {
	switch (action.type) {
	case 'INIT_LIQPAY_DATA':
		return action.data.reverse()
	default:
		return state
	}
}

/**
 * Get payment list from liqpay
 */
export const getLiqPayData = (range) => {
	return async dispatch => {
		const payments = await paymentService.getLiqPayResults(range)
		dispatch ({
			type: 'INIT_LIQPAY_DATA',
			data: payments.data
		})
	}
}

export default liqPayDataReducer
