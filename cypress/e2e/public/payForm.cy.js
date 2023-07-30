describe('Payment form', function() {
	before(function() {
		cy.resetDb()
		cy.createTeachers()
		cy.createSpecialties()
	})

	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.visit('/pay/form')
	})

	it('can be opened and filled', function() {

		cy.location('pathname').should('equal', '/pay/form')
		cy.contains('Оплата навчання')

		cy.contains('div', 'Викладач')
			.find('input').first().type('John Tester Doe')

		cy.contains('div', 'Прізвище учня')
			.find('input').first().type('Test Pupil')

		cy.contains('div', 'Фах або повна вартість навчання')
			.find('select').first().select('Java')

		cy.contains('div', 'вересень')
			.find('[type="checkbox"]').first().check({ force: true })

		cy.contains('Всього: 359.98')
	})

})