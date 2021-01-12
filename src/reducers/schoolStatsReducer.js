import schoolStatsService from '../services/schoolStats'

const schoolStatsReducer = (state = null, action) => {
	switch (action.type) {
	case 'INIT_SCHOOL_STATS':
		return action.data
	default:
		return state
	}
}

/**
 * Get all current school stats
 */
export const initializeSchoolStats = () => {
	return async dispatch => {
		const stats = await schoolStatsService.getAll()
		dispatch ({
			type: 'INIT_SCHOOL_STATS',
			data: stats
		})
	}
}

export default schoolStatsReducer
