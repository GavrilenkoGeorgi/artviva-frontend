describe('Payment form', function() {
	before(function() {
		cy.resetDb()
		cy.createTeachers()
		cy.createSpecialties()
	})

	beforeEach(function() {
		cy.visit('/pay/form')
	})

	it('can be opened and filled', function() {
		const currentMonth = new Date().toLocaleDateString('uk', { month: 'long' })

		cy.location('pathname').should('equal', '/pay/form')
		cy.contains('Оплата навчання')

		cy.contains('div', 'Викладач')
			.find('input').first().type('John Tester Doe')

		cy.contains('div', 'Прізвище учня')
			.find('input').first().type('Test Pupil')

		cy.contains('div', 'Предмет')
			.find('select').first().select('Java')

		cy.contains('div', currentMonth)
			.find('[type="checkbox"]').first().check({ force: true })

		cy.contains('Всього: 350')
		cy.contains('Плюс відсотки платіжної системи (2.85%): 9.97')
	})

})