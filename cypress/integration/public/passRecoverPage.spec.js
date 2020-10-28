describe('Password recover page', function() {
	beforeEach(function() {
		cy.visit('/recover')
	})

	it('can be opened', function() {
		cy.location('pathname').should('equal', '/recover')
		cy.contains('Cкидання пароля')
		cy.contains('Електронна пошта:')
		cy.contains('Надіслати')
	})

	it('user can recover password', function() {
		cy.contains('div', 'Електронна пошта:')
			.find('input').type(Cypress.env('email'))

		cy.contains('Надіслати').click()
		cy.contains('На вашу електронну адресу надіслано лист з інструкціями щодо відновлення пароля')
	})
})