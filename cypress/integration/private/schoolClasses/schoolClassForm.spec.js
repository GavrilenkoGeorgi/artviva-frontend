describe('School class form', function() {
	before(function() {
		cy.resetDb()
		cy.createDefaultState()
	})

	beforeEach(function() {
		cy.login()
		cy.visit('/school/groups')
		cy.contains('Додати нову').click()
	})

	it('shows error on ivalid group name input', function() {
		cy.contains('div', 'Назва групи')
			.find('input').type('G').blur()
		cy.contains('Не менш 2 символів')
	})

	it('shows error if pupil name input is empty', function() {
		cy.get('[data-cy=pupil-0]').click().blur()
		cy.contains('Це поле є обов\'язковим')
	})

	it('shows "add pupil" button if no pupils have been added', function() {
		cy.get('[data-cy=remove-pupil-0]').click()
		cy.contains('Додати учня')
	})

	it('"add pupil" button adds new pupil input field', function() {
		cy.get('[data-cy=remove-pupil-0]').click()
		cy.contains('Додати учня').click()
		cy.get('[data-cy=pupil-0]').should('exist')
	})

	/*it.only('shown error on invalid teacher name input', function() {
		cy.contains('div', 'Викладач')
			.find('input').type('Unknown Teacher')
		cy.contains('Введіть ім\'я викладача')
	})*/

	it('can be filled', function() {
		// cy.contains('Додати нову').click()
		cy.contains('div', 'Назва групи')
			.find('input').type('Newly added group')
			.should('have.value', 'Newly added group')

		cy.contains('div', 'Опис групи')
			.find('textarea').type('Newly added group description')
			.should('have.value', 'Newly added group description')

		cy.contains('div', 'Викладач')
			.find('input').type('Mary Tester Doe')
			.should('have.value', 'Mary Tester Doe')

		cy.contains('div', 'Фах групи')
			.find('input').type('Java')
			.should('have.value', 'Java')

		cy.get('[data-cy=pupil-0]')
			.type('First Test Pupil')
			.should('have.value', 'First Test Pupil')

		cy.get('[data-cy=add-pupil-0').click()
		cy.get('[data-cy=pupil-1]')
			.type('Second Test Pupil')
			.should('have.value', 'Second Test Pupil')
	})
})
