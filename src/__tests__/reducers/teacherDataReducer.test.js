import teacherDataReducer from '../../reducers/teacherDataReducer'
import singleTeacherData from '../../__mocks__/singleTeacherData.json'

describe('Single teacher data reducer', () => {
	it('returns default state', () => {
		const defaultState = teacherDataReducer(undefined, {})
		expect(defaultState).toEqual(null)
	})

	it('returns existing teacher data', () => {
		const newState = teacherDataReducer(singleTeacherData, {
			type: 'GET_TEACHER_DATA',
			data: singleTeacherData
		})

		expect(newState).toEqual(
			expect.objectContaining(singleTeacherData)
		)
	})

	it('updates teacher data', () => {
		const updatedTeacher = {
			...singleTeacherData,
			name: 'Updated teacher'
		}
		const updatedState = teacherDataReducer(updatedTeacher, {
			type: 'UPDATE_TEACHER',
			data: updatedTeacher
		})

		expect(updatedState).toEqual(
			expect.objectContaining(updatedTeacher)
		)
		expect(updatedState.name).toEqual('Updated teacher')
	})

	it('creates new teacher with linked user account', () => {
		const newlyCreatedTeacher = {
			...singleTeacherData,
			name: 'Newly created teacher'
		}

		const newState = teacherDataReducer(undefined, {
			type: 'CREATE_TEACHER',
			data: newlyCreatedTeacher
		})

		expect(newState.name).toEqual('Newly created teacher')
	})

})
