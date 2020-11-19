describe('Pupil assign routine', function() {
	before(function() {
		cy.resetDb()
		cy.createPupils()
	})

	beforeEach(function() {
		cy.login()
		cy.visit('/school/pupils')
	})

	it('correctly assigns pupil to a user account', function() {
		cy.contains('First Test Pupil').click()
		cy.contains('div', 'First Test Pupil')
			// eslint-disable-next-line
			.within($div => {
				cy.get('[data-cy=edit-pupil]').click()
			})
		cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
			.parent('div').find('input').type('Doe').clear().type('test@example.com')

		cy.contains('Зберегти').click()
		cy.contains('Зміни успішно збережено')
	})
})