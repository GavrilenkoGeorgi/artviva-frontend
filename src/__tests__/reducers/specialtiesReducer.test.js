import specialtiesReducer from '../../reducers/specialtiesReducer'
import specialties from '../../__mocks__/specialties'

describe('Specialties reducer', () => {
	test('returns default state', () => {
		const defaultState = specialtiesReducer(undefined, {})
		expect(defaultState).toEqual([])
	})

	test('returns specialties list', () => {
		const newState = specialtiesReducer(specialties, {
			type: 'INIT_SPECIALTIES',
			data: specialties
		})
		expect(newState).toHaveLength(specialties.length)
	})

	test('deletes single specialty', () => {
		const [ specToDelete, specToKeep ] = specialties

		const newState = specialtiesReducer(specialties, {
			type: 'DELETE_SPECIALTY',
			data: specToDelete.id
		})

		expect(newState).toHaveLength(specialties.length - 1)
		expect(newState).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining(specToDelete)
			])
		)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(specToKeep)
			])
		)
	})

	test('updates specialty', () => {
		const [ specialty ] = specialties
		const updatedState = specialtiesReducer(specialties, {
			type: 'UPDATE_SPECIALTY',
			data: { ...specialty, cost: 333, info: 'updated info' }
		})
		const [ updatedSpec ] = updatedState

		expect(updatedSpec.cost).toEqual(333)
		expect(updatedSpec.info).toContain('updated info')
	})

	test('creates new specialty', () => {
		const newSpec = {
			title: 'Newly created spec',
			cost: 199,
			info: '',
			teachers: '',
			schoolClasses: '',
			id: 'updated_spec_test_id_3'
		}

		const newState = specialtiesReducer(specialties, {
			type: 'CREATE_SPECIALTY',
			data: newSpec
		})

		expect(newState).toHaveLength(specialties.length + 1)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(newSpec)
			])
		)
	})
})
