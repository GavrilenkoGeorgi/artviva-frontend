describe('Registering new user', function() {
	before(function() {
		cy.resetDb()
	})

	it('register page can be opened', function() {
		cy.visit('/')
		cy.contains('Школа').click()
		cy.contains('Реєстрація').click()
		cy.location('pathname').should('equal', '/register')
		cy.contains('Реєстрація')
	})

	it('register terms modal can be opened', function() {
		cy.visit('/register')
		cy.contains('a', 'умовами').click()
		cy.contains('Мої персональні дані, на обробку яких я даю цю згоду')
		cy.contains('Я згоден').click()
		cy.contains('Мої персональні дані, на обробку яких я даю цю згоду')
			.should('not.exist')
	})

	it('user can register by filling the form', function() {
		cy.visit('/register')
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').type('register@example.com')

		cy.contains('div', 'Ваше ім\'я')
			.find('input').type('Newly')

		cy.contains('div', 'По батькові')
			.find('input').type('Registered')

		cy.contains('div', 'Прізвище')
			.find('input').type('User')

		cy.contains('div', 'Ваш пароль')
			.find('input').type('TestPassword1')

		cy.contains('div', 'Підтвердження пароля')
			.find('input').type('TestPassword1')

		cy.contains('div', 'Я погоджуюся з умовами використання сайту')
			.find('[type="checkbox"]').first().check({ force: true })

		cy.contains('Зареєструватися').click()
		cy.contains('Ви отримаєте електронний лист із посиланням для активації свого акаунта')
	})
})