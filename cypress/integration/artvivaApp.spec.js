// Mocha recommends that arrow functions are not to be used,
// because they might cause some issues in certain situations
// https://mochajs.org/#arrow-functions

describe('Artviva app', function() {
	it('front page can be opened', function() {
		cy.visit('/')
		cy.contains('ArtViva')
		cy.contains('КПНЗ Шпитьківська ДШМ')
	})

	it('login form can be opened', function() {
		cy.contains('Школа').click()
		cy.contains('Вхід').click()
	})

	it('user can login using UI', function() {
		cy.request('POST', '/api/testing/reset')
		cy.visit('/login')
		cy.get('[data-cy=email-input]').type('test@example.com')
		cy.get('[data-cy=password-input]').type('TestPassword1')
		cy.contains('Вхід').click()
		cy.contains('test@example.com')
	})
})

describe('when logged in', function() {
	beforeEach(function() {
		cy.login()
		cy.visit('/school')
	})

	it('user can navigate profile page', function() {
		cy.contains('Профіль').click()
		cy.contains('Joe Tester Doe')

		cy.contains('Групи').click()
		cy.contains('Ваші групи в школи')

		cy.contains('Учні').click()
		cy.contains('Ваши учні')
	})

	it('user can view list of payments', function() {
		cy.contains('Платежи').click()
		cy.contains('Список всіх платежів')
	})
})