import paymentService from '../services/payment'

const paymentsReducer = (state = [], action) => {
	switch (action.type) {
	case 'INIT_PAYMENTS':
		return action.data
	default:
		return state
	}
}

/**
 * Initialise payments list
 */
export const initialisePayments = () => {
	return async dispatch => {
		const pupils = await paymentService.getAll()
		dispatch ({
			type: 'INIT_PAYMENTS',
			data: pupils
		})
	}
}

export default paymentsReducer
