import pupilsReducer from '../../reducers/pupilsReducer'
import pupils from '../../__mocks__/pupils.json'

describe('Pupils reducer', () => {
	it('returns default state', () => {
		const defaultState = pupilsReducer(undefined, {})
		expect(defaultState).toEqual([])
	})

	it('returns array with list of all pupils', () => {
		const initialState = pupilsReducer(pupils, {
			type: 'INIT_PUPILS',
			data: [ ...pupils ]
		})

		expect(initialState).toHaveLength(pupils.length)
	})

	it('adds newly created pupil into the existing array', () => {
		const [ pupil ] = pupils
		const newPupil = {
			...pupil,
			name: 'Newly created pupil',
			id: 'new_id_1'
		}

		const newState = pupilsReducer(pupils, {
			type: 'CREATE_PUPIL',
			data: newPupil
		})

		expect(newState).toHaveLength(pupils.length + 1)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(newPupil)
			])
		)

		// new pupil is inserted in the begging, so..
		const [ firstPupil ] = newState
		expect(firstPupil.name).toEqual('Newly created pupil')
		expect(firstPupil.id).toEqual('new_id_1')
	})

	it('updates pupil data', () => {
		const [ pupil ] = pupils
		const updatedPupil = {
			...pupil,
			name: 'Updated pupil'
		}

		const updatedState = pupilsReducer(pupils, {
			type: 'UPDATE_PUPIL',
			data: updatedPupil
		})

		expect(updatedState).toHaveLength(pupils.length)
		expect(updatedState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(updatedPupil)
			])
		)
	})

	it('deletes pupil from array', () => {
		const [ pupilToDelete ] = pupils
		const newState = pupilsReducer(pupils, {
			type: 'DELETE_PUPIL',
			data: pupilToDelete.id
		})

		expect(newState).toHaveLength(pupils.length - 1)
		expect(newState).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining(pupilToDelete)
			])
		)
	})

	it('sorts pupil\'s array', () => {
		// eslint-disable-next-line
		const [ unsortedFirstPupil, unsortedSecondPupil ] = pupils
		const sort = {
			field: 'name',
			order: 'desc'
		}
		const sortedState = pupilsReducer(pupils, {
			type: 'SORT_PUPILS_LIST',
			data: sort
		})

		const [ firstPupil ] = sortedState
		expect(firstPupil.name).toEqual(unsortedSecondPupil.name)
	})
})
