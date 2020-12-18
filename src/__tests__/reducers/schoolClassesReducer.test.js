import schoolClassesReducer from '../../reducers/schoolClassesReducer'
import schoolClasses from '../../__mocks__/schoolClasses.json'

describe('School classes reducer', () => {
	it('returns default state', () => {
		const defaultState = schoolClassesReducer(undefined, {})
		expect(defaultState).toEqual([])
	})

	it('returns school classes array', () => {
		const newState = schoolClassesReducer(schoolClasses, {
			type: 'INIT_SCHOOL_CLASSES',
			data: schoolClasses
		})
		expect(newState).toHaveLength(schoolClasses.length)

		const [ firstClass ] = newState
		expect(firstClass.title).toBe('Лісова кваліметрія')
	})

	it('creates new school class', () => {
		const [ schoolClass ] = schoolClasses
		const newClass = {
			...schoolClass,
			title: 'Newly creates class',
			id: 'new_id'
		}

		const newState = schoolClassesReducer(schoolClasses, {
			type: 'CREATE_SCHOOL_CLASS',
			data: newClass
		})

		expect(newState).toHaveLength(schoolClasses.length + 1)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(newClass)
			])
		)
	})

	it('updates school class', () => {
		const [ schoolClass ] = schoolClasses
		const updatedClass = {
			...schoolClass,
			title: 'Updated class'
		}
		const newState = schoolClassesReducer(schoolClasses, {
			type: 'UPDATE_SCHOOL_CLASS',
			data: updatedClass
		})

		expect(newState).toHaveLength(schoolClasses.length)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(updatedClass)
			])
		)
	})

	it('deletes school class', () => {
		const [ classToDelete ] = schoolClasses

		const newState = schoolClassesReducer(schoolClasses, {
			type: 'DELETE_SCHOOL_CLASS',
			data: classToDelete.id
		})

		expect(newState).toHaveLength(schoolClasses.length - 1)
		expect(newState).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining(classToDelete)
			])
		)
	})
})
