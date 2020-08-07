import paymentService from '../services/payment'

const paymentsReducer = (state = [], action) => {
	switch (action.type) {
	case 'INIT_PAYMENTS':
		return action.data.reverse()
	case 'UPDATE_PAYMENT_DESCR': {
		return state.map(payment =>
			payment.paymentDescr.id !== action.data.id
				? payment
				: { ...payment, paymentDescr: action.data })
	}
	default:
		return state
	}
}

/**
 * Initialise payments list
 */
export const initialisePayments = () => {
	return async dispatch => {
		const payments = await paymentService.getAll()
		dispatch ({
			type: 'INIT_PAYMENTS',
			data: payments
		})
	}
}

/**
 * Update payment description
 */
export const updatePaymentDescr = (id, values) => {
	return async dispatch => {
		const paymentDescr = await paymentService.updateDescr(id, values)
		dispatch ({
			type: 'UPDATE_PAYMENT_DESCR',
			data: paymentDescr
		})
	}
}

export default paymentsReducer
