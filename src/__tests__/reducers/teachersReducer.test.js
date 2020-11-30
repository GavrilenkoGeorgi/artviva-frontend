import teachersReducer from '../../reducers/teachersReducer'
import teachers from '../../__mocks__/teachers.json'

describe('Teachers reducer', () => {
	it('returns default state', () => {
		const defaultState = teachersReducer(undefined, {})
		expect(defaultState).toEqual([])
	})

	it('initialises teachers data', () => {
		const newState = teachersReducer(teachers, {
			type: 'INIT_TEACHERS',
			data: teachers
		})

		expect(newState).toHaveLength(teachers.length)
	})

	it('creates new teacher', () => {
		const [ teacher ] = teachers
		const newTeacher = {
			...teacher,
			name: 'Newly created teacher',
			id: 'new_id_1'
		}

		const newState = teachersReducer(teachers, {
			type: 'CREATE_TEACHER',
			data: newTeacher
		})

		expect(newState).toHaveLength(teachers.length + 1)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(newTeacher)
			])
		)
	})

	it('updates teacher data', () => {
		const [ teacher ] = teachers
		const updatedTeacher = {
			...teacher,
			name: 'Updated Teacher Name'
		}

		const updatedState = teachersReducer(teachers, {
			type: 'UPDATE_TEACHER',
			data: updatedTeacher
		})

		expect(updatedState).toHaveLength(teachers.length)
		expect(updatedState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(updatedTeacher)
			])
		)
	})

	it.only('deletes teacher', () => {
		const [ teacher ] = teachers

		const newState = teachersReducer(teachers, {
			type: 'DELETE_TEACHER',
			data: teacher.id
		})

		expect(newState).toHaveLength(teachers.length - 1)
		expect(newState).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining(teacher)
			])
		)
	})
})