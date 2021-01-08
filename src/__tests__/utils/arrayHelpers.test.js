import { compareValues, nestedSort, findByPropertyValue,
	multiPropsFilter, boolPropsFilter } from '../../utils/arrayHelpers'

describe('Array helpers', () => {
	const users = [
		{ name: 'Joe', age: 18 },
		{ name: 'Ann', age: 35 }
	]

	const [ joe, ann ] = users

	describe('compareValues', () => {
		it('compareValues helper correctly compares object by name', () => {
			const sorted = users.sort(compareValues('name'))
			const [ user ] = sorted

			expect(user).toEqual(ann)
		})

		it('compareValues helper correctly compares object by name in desc order', () => {
			const sorted = users.sort(compareValues('name', 'desc'))
			const [ user ] = sorted

			expect(user).toEqual(joe)
		})

		it('compareValues helper correctly compares object by age', () => {
			const sorted = users.sort(compareValues('age'))
			const [ user ] = sorted

			expect(user).toEqual(joe)
		})

		it('compareValues helper correctly compares object by age in desc order', () => {
			const sorted = users.sort(compareValues('age', 'desc'))
			const [ user ] = sorted

			expect(user).toEqual(ann)
		})
	})

	describe('nestedSort', () => {
		const users = [
			{ name: 'Joe',
				stats: {
					age: 18,
					xp: 75
				}
			},
			{ name: 'Ann',
				stats: {
					age: 35,
					xp: 50
				}
			},
			{ name: 'Bill',
				stats: {
					age: 27,
					xp: 100
				}
			}
		]

		const [ joe, ann, bill ] = users

		it('sorts objects by property', () => {
			const sorted = users.sort(nestedSort('name'))
			const [ user ] = sorted

			expect(user).toEqual(ann)
		})

		it('sorts objects by property in desc order', () => {
			const sorted = users.sort(nestedSort('name', null, 'desc'))
			const [ user ] = sorted

			expect(user).toEqual(joe)
		})

		it('sorts objects by nested property', () => {
			const sorted = users.sort(nestedSort('stats', 'xp'))
			const [ user ] = sorted

			expect(user).toEqual(ann)
		})

		it('sorts objects by nested property in desc order', () => {
			const sorted = users.sort(nestedSort('stats', 'xp', 'desc'))
			const [ user ] = sorted

			expect(user).toEqual(bill)
		})
	})

	describe('findByPropertyValue', () => {
		it('finds object by prop value', () => { // array filter?
			const user = findByPropertyValue(ann.name, 'name', users)
			expect(user).toEqual(ann)
		})
	})

	describe('multiPropsFilter', () => { // this one doesn't spark joy
		const users = [
			{
				name: 'Joe',
				type: ['admin', 'teacher', 'employee'],
				gender: 'male'
			},
			{
				name: 'Ann',
				type: ['admin', 'pupil', 'part-time'],
				gender: 'female'
			},
			{
				name: 'Bill',
				type: ['user', 'pupil', 'part-time'],
				gender: 'male'
			}
		]
		// eslint-disable-next-line
		const [ joe, ann, bill ] = users

		it('filters array of objects by multiple properties', () => {
			const filters = {
				gender: 'male',
				type: 'part-time'
			}
			const [ user ] = multiPropsFilter(users, filters)

			expect(user).toEqual(bill)
		})
	})

	describe('boolPropsFilter', () => {
		const users = [
			{
				name: 'Joe',
				active: true,
				registered: true
			},
			{
				name: 'Ann',
				active: true,
				registered: false
			},
			{
				name: 'Bill',
				active: false,
				registered: false
			}
		]
		const [ joe, ann, bill ] = users

		it('filters by boolean props', () => {
			const filters = {
				registered: false
			}
			const filteredUsers = boolPropsFilter(users, filters)
			expect(filteredUsers).toHaveLength(2)

			const [ firstUser, secondUser ] = filteredUsers
			expect(firstUser).toEqual(ann)
			expect(secondUser).toEqual(bill)

			const moreStrictFilter = {
				active: true,
				registered: true
			}

			const resultingUsers = boolPropsFilter(users, moreStrictFilter)
			expect(resultingUsers).toHaveLength(1)

			const [ user ] = resultingUsers
			expect(user).toEqual(joe)
		})
	})
})
