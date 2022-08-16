describe('School classes routines', function() {
	before(function() {
		// seed the DB
		cy.resetDb()
		cy.createDefaultState()
	})

	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.login()
		cy.visit('/school/groups')
	})

	it('list of classes can be viewed', function() {
		cy.contains('Всі групи в школи')
		cy.contains('Загалом: 2')
		cy.contains('First Test Class')
		cy.contains('Second Test Class')
	})

	it('new group form can be opened', function() {
		cy.contains('Додати нову').click()
		cy.contains('Додати нову групу')
		cy.contains('Перелік учнів')
	})

	it('group teacher can be changed', function() {
		cy.contains('div', 'Second Test Class').click()
			.within(() => {
				cy.get('[data-cy=edit-group]').click()
			})
		cy.contains('div', 'Викладач')
			.find('input').clear()

		cy.contains('div', 'Викладач')
			.find('input').type('John Tester Doe')
		// eslint-disable-next-line
		cy.wait(1000)
		cy.contains('Зберегти групу').click()
		cy.contains('Зміни успішно збережено')
		cy.contains('div', 'Second Test Class')
			.within(() => {
				cy.contains('John Tester Doe')
			})
	})

	it('pupil can be added to the group', function() {
		cy.contains('div', 'First Test Class').click()
			.within(() => {
				cy.get('[data-cy=edit-group]').click()
			})
		cy.get('[data-cy=add-pupil-0').click()
		cy.get('[data-cy=pupil-1]').type('Second Test Pupil')
		cy.contains('Зберегти групу').click()
		cy.contains('Зміни успішно збережено')
		cy.contains('div', 'First Test Class')
			.within(() => {
				cy.contains('Second Test Pupil')
			})
	})

	it('pupil can be removed from the group', function() {
		cy.contains('div', 'Second Test Class').click()
			.within(() => {
				cy.get('[data-cy=edit-group]').click()
			})
		cy.get('[data-cy=remove-pupil-1').click()
		cy.contains('Зберегти групу').click()
		cy.contains('Зміни успішно збережено')
		cy.contains('div', 'Second Test Class')
			.within(() => {
				cy.contains('Second Test Pupil').should('not.exist')
			})
	})

	it('group info can be added', function() {
		cy.contains('div', 'Second Test Class').click()
			.within(() => {
				cy.get('[data-cy=edit-group]').click()
			})
		cy.contains('div', 'Опис групи')
			.find('textarea').type('Some new info')

		cy.contains('Зберегти групу').click()
		cy.contains('Зміни успішно збережено')
		cy.contains('div', 'Second Test Class').click()
			.within(() => {
				cy.contains('Some new info')
			})
	})

	it('group specialty can be changed', function() {
		cy.contains('div', 'Second Test Class').click()
			.within(() => {
				cy.get('[data-cy=edit-group]').click()
			})
		cy.contains('div', 'Фах групи')
			.find('input').clear().type('Java advanced')

		cy.contains('Зберегти групу').click()
		cy.contains('Зміни успішно збережено')
		cy.contains('div', 'Second Test Class').click()
			.within(() => {
				cy.contains('Java advanced')
			})
	})

	it('group name can be edited', function() {
		cy.contains('div', 'First Test Class').click()
			.within(() => {
				cy.get('[data-cy=edit-group]').click()
			})
		cy.contains('div', 'Назва групи')
			.find('input').clear().type('Renamed group')

		cy.contains('Зберегти групу').click()
		cy.contains('Зміни успішно збережено')
		cy.contains('Renamed group')
	})

	it('new group can be added', function() {
		cy.contains('Додати нову').click()

		cy.contains('div', 'Назва групи')
			.find('input').type('Newly added group')

		cy.contains('div', 'Опис групи')
			.find('textarea').type('Newly added group description')

		cy.contains('div', 'Викладач')
			.find('input').type('Mary Tester Doe')

		cy.contains('div', 'Фах групи')
			.find('input').type('Java')

		cy.get('[data-cy=pupil-0]') // this!
			.type('First Test Pupil')

		cy.contains('Додати групу').click()
		cy.contains('Новий клас був успішно додан')
		cy.contains('Newly added group')
	})
})
