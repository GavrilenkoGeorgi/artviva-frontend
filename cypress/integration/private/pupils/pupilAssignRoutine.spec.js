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
			.parent('div').find('input').type('test@example.com')

		cy.contains('Зберегти').click()
		cy.contains('Зміни успішно збережено')
	})

	it('correctly removes assigned user account from pupil profile', function() {
		cy.contains('Second Test Pupil').click()
		cy.contains('div', 'Second Test Pupil')
			// eslint-disable-next-line
			.within($div => {
				cy.get('[data-cy=edit-pupil]').click()
			})
		cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
			.parent('div').find('input').type('test@example.com')

		cy.contains('Зберегти').click()

		cy.contains('div', 'Second Test Pupil')
			// eslint-disable-next-line
			.within($div => {
				cy.get('[data-cy=edit-pupil]').click()
			})
		cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
			.parent('div').find('input').clear()

		cy.contains('Зберегти').click()

		cy.contains('div', 'Second Test Pupil')
			// eslint-disable-next-line
			.within($div => {
				cy.get('[data-cy=edit-pupil]').click()
			})

		cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
			.parent('div').find('input').should('have.value', '')
		cy.contains('Наразі цей учень ще не призначений жодному вчителю')

	})
})