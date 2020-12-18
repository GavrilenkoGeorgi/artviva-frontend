import liqpayDataReducer from '../../reducers/liqPayDataReducer'
import liqpayPayments from '../../__mocks__/liqpayPayments.json'

describe('Liqpay payments data reducer', () => {
	it('returns default state', () => {
		const defaultState = liqpayDataReducer(undefined, {})
		expect(defaultState).toEqual([])
	})

	it('returns initial array of payments', () => {
		const initialState = liqpayDataReducer(liqpayPayments, {
			type: 'INIT_LIQPAY_DATA',
			data: liqpayPayments
		})

		expect(initialState).toHaveLength(liqpayPayments.length)
	})
})
