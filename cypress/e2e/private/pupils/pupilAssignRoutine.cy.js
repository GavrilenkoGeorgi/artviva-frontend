describe('Pupil assign routine', function() {
	before(function() {
		cy.resetDb()
		cy.createPupils()
	})

	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.login()
		cy.visit('/school/pupils')
	})

	it('correctly assigns pupil to a user account', function() {
		cy.contains('First Test Pupil').click()
		cy.contains('div', 'First Test Pupil')
			.within(() => {
				cy.get('[data-cy=edit-pupil]').click()
			})
		cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
			.find('input').type('Doe').clear().type('test@example.com').blur()

		cy.contains('Зберегти').click()
		cy.contains('Зміни успішно збережено')
	})
})