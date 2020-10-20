describe('Payment form', function() {
	it('can be opened', function() {
		cy.visit('/pay/form')
		cy.location('pathname').should('equal', '/pay/form')
	})
})