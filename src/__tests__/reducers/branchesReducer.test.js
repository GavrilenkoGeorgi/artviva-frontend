import branchesReducer from '../../reducers/branchesReducer'
import branches from '../../__mocks__/branches.json'

describe('Branches reducer', () => {
	it('returs default state', () => {
		const defaultState = branchesReducer(undefined, {})
		expect(defaultState).toEqual([])
	})

	it('returns an array of all branches', () => {
		const initialState = branchesReducer(branches, {
			type: 'INIT_BRANCHES',
			data: branches
		})

		expect(initialState).toHaveLength(branches.length)
	})

	it('updates branch', () => {
		const [ branch ] = branches
		const updatedBranch = {
			...branch,
			name: 'Updated branch'
		}

		const updatedState = branchesReducer(branches, {
			type: 'UPDATE_BRANCH',
			data: updatedBranch
		})

		expect(updatedState).toHaveLength(branches.length)
		expect(updatedState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(updatedBranch)
			])
		)
	})

	it('creates new branch', () => {
		const [ branch ] = branches
		const newBranch = {
			...branch,
			name: 'Newly created branch',
			id: 'test_id_1'
		}

		const newState = branchesReducer(branches, {
			type: 'CREATE_BRANCH',
			data: newBranch
		})

		expect(newState).toHaveLength(branches.length + 1)
		expect(newState).toEqual(
			expect.arrayContaining([
				expect.objectContaining(newBranch)
			])
		)
	})

	it('deletes branch', () => {
		const [ branchToDelete ] = branches

		const newState = branchesReducer(branches, {
			type: 'DELETE_BRANCH',
			data: branchToDelete.id
		})

		expect(newState).toHaveLength(branches.length - 1)
		expect(newState).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining(branchToDelete)
			])
		)
	})
})
