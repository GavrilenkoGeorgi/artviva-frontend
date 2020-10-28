import notificationReducer from '../reducers/notificationReducer'

const initialState = {
	message: null,
	variant: null,
	processingForm: false,
	fetchingData: false,
	searching: false,
	reCaptchaScore: null
}

describe('Notification reducer', () => {
	test('returns default state', () => {
		const defaultState = notificationReducer(undefined, {})
		expect(defaultState).toEqual(initialState)
	})

	test('sets notification correctly', () => {
		const newState = notificationReducer(undefined, {
			type: 'SET_NOTIFICATION',
			message: 'Test message',
			variant: 'success'
		})

		expect(newState.message).toBe('Test message')
		expect(newState.variant).toBe('success')
	})

	test('clears notification after a given amount of time', () => {
		const newState = notificationReducer(undefined, {
			type: 'SET_NOTIFICATION',
			message: 'Test timeout message',
			variant: 'info'
		})

		expect(newState.message).toBe('Test timeout message')
		expect(newState.variant).toBe('info')

		setTimeout(() => {
			expect(newState.message).toBe(null)
			expect(newState.variant).toBe(null)
		}, 1500)
	})

	test('closes notification manually', () => {
		notificationReducer(undefined, {
			type: 'SET_NOTIFICATION',
			message: 'Test message',
			variant: 'success'
		})

		const resultingState = notificationReducer(undefined, {
			type: 'CLOSE_NOTIFICATION'
		})

		expect(resultingState.message).toBe(null)
		expect(resultingState.variant).toBe(null)
	})

	test('correctly sets and clears \'processing form\' notification state', () => {
		const processingState = notificationReducer(undefined, {
			type: 'SET_PROCESSING_FORM',
			processingForm: true
		})
		expect(processingState.processingForm).toBe(true)

		const idleState = notificationReducer(undefined, {
			type: 'SET_PROCESSING_FORM',
			processingForm: false
		})
		expect(idleState.processingForm).toBe(false)
	})

	test('correctly sets and clears \'fetching data\' notification state', () => {
		const fetchingState = notificationReducer(undefined, {
			type: 'SET_FETCHING_DATA',
			fetchingData: true
		})
		expect(fetchingState.fetchingData).toBe(true)

		const idleState = notificationReducer(undefined, {
			type: 'SET_FETCHING_DATA',
			fetchingData: false
		})
		expect(idleState.fetchingData).toBe(false)
	})

	test('correctly sets and clears \'searching\' notification state', () => {
		const searchingState = notificationReducer(undefined, {
			type: 'SET_SEARCHING',
			searching: true
		})
		expect(searchingState.searching).toBe(true)

		const idleState = notificationReducer(undefined, {
			type: 'SET_SEARCHING',
			searching: false
		})
		expect(idleState.searching).toBe(false)
	})

	test('correctly sets and clears reCaptcha score', () => {
		const reCaptchaScoreState = notificationReducer(undefined, {
			type: 'SET_RECAPTCHA_SCORE',
			score: .9
		})
		expect(reCaptchaScoreState.reCaptchaScore).toBe(.9)

		const clearedScoreState = notificationReducer(undefined, {
			type: 'CLEAR_RECAPTCHA_SCORE',
			score: null
		})
		expect(clearedScoreState.reCaptchaScore).toBe(null)
	})
})
