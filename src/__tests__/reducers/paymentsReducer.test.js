import paymentsReducer from '../../reducers/paymentsReducer'
import payments from '../../__mocks__/payments.json'

describe('Payments reducer', () => {
	it('returns default state', () => {
		const defaultState = paymentsReducer(undefined, {})

		expect(defaultState).toEqual([])
	})

	it('returns payments array', () => {
		const initialState = paymentsReducer(payments, {
			type: 'INIT_PAYMENTS',
			data: payments
		})

		expect(initialState).toHaveLength(payments.length)
	})

	it('updates payment description', () => {
		const [ payment ] = payments

		const updatedPayment = {
			...payment,
			paymentDescr: {
				...payment.paymentDescr,
				pupil: 'Edited Pupil Name'
			}
		}

		const updatedState = paymentsReducer(payments, {
			type: 'UPDATE_PAYMENT_DESCR',
			data: updatedPayment.paymentDescr
		})

		expect(updatedState).toHaveLength(payments.length)
		expect(updatedState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(updatedPayment)
			])
		)
	})

})