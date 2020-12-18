import schoolStatsReducer from '../../reducers/schoolStatsReducer'
import schoolStats from '../../__mocks__/schoolStats.json'

describe('School stats reducer', () => {
	it('returns default state', () => {
		const defaultState = schoolStatsReducer(undefined, {})

		expect(defaultState).toEqual({})
	})

	it('initialises school stats with data from DB', () => {
		const newState = schoolStatsReducer(schoolStats, {
			type: 'INIT_SCHOOL_STATS',
			data: schoolStats
		})

		expect(newState).toHaveProperty('teachers')
		expect(newState).toHaveProperty('pupils')
		expect(newState).toHaveProperty('specialties')
		expect(newState).toHaveProperty('schoolClasses')
	})
})