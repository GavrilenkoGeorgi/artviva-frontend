describe('Contact form', function() {
	beforeEach(() => {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
	})

	it('a message can be sent through it', function() {
		cy.visit('/')
		// eslint-disable-next-line
		cy.contains('Зворотній зв\'язок').scrollIntoView().wait(750)
		cy.contains('div', 'Ваше ім\'я')
			.find('input').first().type('Tester')
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').first().type('test@example.com')
		cy.contains('div', 'Ваше повідомлення')
			.find('textarea').first().type('Cypress test message')
		cy.contains('Відправити').click()
		cy.contains('Ваше повідомлення надіслано, дякуємо вам')
	})
})