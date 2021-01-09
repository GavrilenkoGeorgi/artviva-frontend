import getPaymentDataFromString from '../../utils/parsePaymentDescr'

describe('Payment description parser', () => {
	// eslint-disable-next-line
	const paymentDescr = 'Оплата: лютий, березень, квітень. Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.'
	const parsedDescr = {
		teacher: 'Hank Hill',
		pupil: 'Bobby Hill',
		specialty: 'Саксофон',
		months: [ 'лютий', 'березень', 'квітень' ]
	}

	it('correctly parses payment description string', () => {
		const result = getPaymentDataFromString(paymentDescr, 'uk-UA')
		expect(result).toEqual(parsedDescr)
	})

	it('throws an error if description string is missing', () => {
		expect(() => getPaymentDataFromString('', 'uk-UA'))
			.toThrowError('Payment description string is required.')

		expect(() => getPaymentDataFromString({}, 'uk-UA'))
			.toThrowError('Payment description string is required.')
	})

	it('throws an error if description string is malformed', () => {
		// eslint-disable-next-line
		const malformedPaymentDescr = 'Викладач: Hank Hill. Учень: Bobby Hill. Предмет: Саксофон.'

		expect(() => getPaymentDataFromString(malformedPaymentDescr, 'uk-UA'))
			.toThrowError('Payment description string is malformed. Missing marker: Оплата:')
	})
})
