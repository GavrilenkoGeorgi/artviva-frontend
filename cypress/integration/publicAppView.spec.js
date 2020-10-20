// Mocha recommends that arrow functions are not to be used,
// because they might cause some issues in certain situations
// https://mochajs.org/#arrow-functions

describe('Artviva public app view', function() {
	beforeEach(function () {
		cy.visit('/')
	})

	it('front page can be opened and footer is visible', function() {
		cy.contains('ArtViva')
		cy.contains('КПНЗ Шпитьківська ДШМ')
	})

	it('teachers page can be opened', function() {
		cy.contains('Вчителі').click()
		cy.location('pathname').should('equal', '/teachers')
		cy.contains('Адміністрація')
		cy.contains('Наші вчителі')
	})

	it('showcase page can be opened', function() {
		cy.contains('На сцені').click()
		cy.location('pathname').should('equal', '/showcase')
	})

	it('about page can be opened', function() {
		cy.contains('Історія').click()
		cy.location('pathname').should('equal', '/about')
		cy.contains('Позаду 40 років діяльності навчального закладу')
	})

	it('blog page can be opened', function() {
		cy.contains('Блог').click()
		cy.location('pathname').should('equal', '/blog')
		cy.contains('Фейсбук')
	})

	it('contacts page can be opened', function() {
		cy.contains('Контакти').click()
		cy.location('pathname').should('equal', '/contacts')
		cy.contains('Філії')
	})

	it('teachers list can be expanded', function() {
		cy.visit('/teachers')

		// eslint-disable-next-line
		cy.contains('Шпитьки').scrollIntoView().wait(750)
		cy.contains('Шпитьки').click()
		cy.contains('Завідуюча відділом')
	})

	it('payment form can be opened', function() {
		cy.contains('Школа').click()
		cy.contains('Оплата навчання').click()
		cy.location('pathname').should('equal', '/pay/form')
		cy.contains('Оплата навчання')
	})

	it('public apply form can be opened', function() {
		cy.contains('Школа').click()
		cy.contains('Подати заяву').click()
		cy.location('pathname').should('equal', '/apply')
		cy.contains('Подати заяву на навчання')
	})

	it('register form can be opened', function() {
		cy.contains('Школа').click()
		cy.contains('Реєстрація').click()
		cy.location('pathname').should('equal', '/register')
		cy.contains('Реєстрація')
	})

	it('public apply button routes to the apply form', function() {
		// eslint-disable-next-line
		cy.contains('Подати заяву').scrollIntoView().wait(750).click()
		cy.location('pathname').should('equal', '/apply')
	})

	it.only('pay button routes to the payment form', function() {
		// eslint-disable-next-line
		cy.contains('Оплатити').scrollIntoView().wait(750).click()
		cy.location('pathname').should('equal', '/pay/form')
	})
})
