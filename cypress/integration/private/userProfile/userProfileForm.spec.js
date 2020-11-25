describe('User profile form', function() {
	before(function() {
		cy.resetDb()
		cy.createSpecialties()
	})

	beforeEach(function() {
		cy.login()
		cy.visit('/school')
		cy.contains('Профіль').click()
		cy.get('[data-cy=edit-user]').click()
	})

	it('user name input can be filled', function() {
		cy.contains('div', 'Ім\'я користувача')
			.find('input').clear().type('Updated Name')
			.should('have.value', 'Updated Name')
	})

	it('user name input shows errors on ivalid input', function() {
		// min chars
		cy.contains('div', 'Ім\'я користувача')
			.find('input').clear().type('a').blur()
		cy.contains('Не менш 3 символів')

		// max chars
		cy.contains('div', 'Ім\'я користувача')
			.find('input').clear().type('Lorem ipsum dolor sit amet, consectetuer adipi').blur()
		cy.contains('Максимум 45 символів')

		// required
		cy.contains('div', 'Ім\'я користувача')
			.find('input').clear().blur()
		cy.contains('Введіть ім\'я')
	})

	it('user middlename input can be filled', function() {
		cy.contains('div', 'По батькові')
			.find('input').clear().type('Updated Middlename')
			.should('have.value', 'Updated Middlename')
	})

	it('user middlename input shows errors on ivalid input', function() {
		// min chars
		cy.contains('div', 'По батькові')
			.find('input').clear().type('b').blur()
		cy.contains('Не менш 3 символів')

		// max chars
		cy.contains('div', 'По батькові')
			.find('input').clear().type('Lorem ipsum dolor sit amet, consectetuer adipi').blur()
		cy.contains('Максимум 45 символів')

		// required
		cy.contains('div', 'По батькові')
			.find('input').clear().blur()
		cy.contains('Введіть по батькові')
	})

	it('user lastname input can be filled', function() {
		cy.contains('div', 'Прізвище')
			.find('input').clear().type('Updated Lastname')
			.should('have.value', 'Updated Lastname')
	})

	it('user lastname input shows errors on ivalid input', function() {
		// min chars
		cy.contains('div', 'Прізвище')
			.find('input').clear().type('c').blur()
		cy.contains('Не менш 3 символів')

		// max chars
		cy.contains('div', 'Прізвище')
			.find('input').clear().type('Lorem ipsum dolor sit amet, consectetuer adipi').blur()
		cy.contains('Максимум 45 символів')

		// required
		cy.contains('div', 'Прізвище')
			.find('input').clear().blur()
		cy.contains('Введіть прізвище')
	})

})
