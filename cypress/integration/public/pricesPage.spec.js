describe('Prices page', function() {
	beforeEach(() => {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.intercept('/api/specialties/prices', { fixture: 'specialtiesPrices.json' })
	})

	it('prices page can be open with prices tab active', function() {
		cy.visit('/')
		cy.contains('Школа').click()
		cy.contains('Ціни').click()

		cy.location('pathname').should('equal', '/prices')
		cy.contains('Інформація про освітні послуги')
		cy.contains('a', 'Ціни').should('have.class', 'active')
		cy.contains('Ціни на навчання')
		cy.contains('350 Java')
	})

	it('benefits tab can be opened', function() {
		cy.visit('/prices')
		cy.contains('Пільги').click()
		cy.contains('a', 'Пільги').should('have.class', 'active')
		cy.contains('Пільги надаються на підставі поданих батьками документів')
	})

	it('education regulations tab can be opened', function() {
		cy.visit('/prices')
		cy.contains('Умови навчання').click()
		cy.contains('a', 'Умови навчання').should('have.class', 'active')
		cy.contains('При написанні заяви батьки зобов\'язуються')
	})
})