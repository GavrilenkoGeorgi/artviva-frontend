describe('Password recover form', function() {
	beforeEach(function() {
		cy.visit('/recover')
	})

	it('shows an error if no email was entered', function() {
		cy.contains('Надіслати').click()
		cy.contains('Введіть свою електронну пошту.')
	})

	it('shows an error if invalid email was entered', function() {
		cy.contains('div', 'Електронна пошта:')
			.find('input').type('test@example').blur()
		cy.contains('Адреса електронної пошти недійсна.')
	})
})