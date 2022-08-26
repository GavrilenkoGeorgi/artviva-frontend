describe('Login form', function() {
	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.visit('/login')
	})

	it('shows an error on invalid email input', function() {
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').type('test@example').blur()
		cy.contains('Адреса електронної пошти недійсна')
	})

	it('show an error on invalid password input', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('TestPass').blur()
		cy.contains('Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число')
	})

	it('show correct error messages when no fields are filled', function() {
		cy.contains('Вхід').click()
		cy.contains('Введіть свою електронну пошту')
		cy.contains('Будь ласка, введіть свій пароль')
	})

	it('can be filled', function() {
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').type('test@example.com')
			.should('have.value', 'test@example.com')

		cy.contains('div', 'Ваш пароль')
			.find('input').type('TestPass1')
			.should('have.value', 'TestPass1')
	})

	it('register link routes to register page', function() {
		cy.contains('Реєстрація').click()
		cy.location('pathname').should('equal', '/register')
	})

	it('password recover link routes to recover page', function() {
		cy.contains('Відновлення паролю').click()
		cy.location('pathname').should('equal', '/recover')
	})
})