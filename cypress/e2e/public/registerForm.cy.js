describe('Register form', function() {
	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.visit('/register')
	})

	// user creds input
	it('shows an error on invalid email input', function() {
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').type('register').blur()
		cy.contains('Адреса електронної пошти недійсна')
	})

	it('shows an error on invalid name input', function() {
		cy.contains('div', 'Ваше ім\'я')
			.find('input').type('ab').blur()
		cy.contains('Не менш 3 символів')
	})

	it('shows an error on invalid middlename input', function() {
		cy.contains('div', 'По батькові')
			.find('input').type('cd').blur()
		cy.contains('Не менш 3 символів')
	})

	it('shows an error on invalid lastname input', function() {
		cy.contains('div', 'Прізвище')
			.find('input').type('ef').blur()
		cy.contains('Не менш 3 символів')
	})

	// password input
	it('toogles password visibility', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('TestPass1')
		// text
		cy.get('[data-cy=toggle-pass-visibility]').click()
		cy.contains('div', 'Ваш пароль')
			.find('input').should('have.attr', 'type', 'text' )
		// password
		cy.get('[data-cy=toggle-pass-visibility]').click()
		cy.contains('div', 'Ваш пароль')
			.find('input').should('have.attr', 'type', 'password' )
	})

	it('toogles password confirmation visibility', function() {
		cy.contains('div', 'Підтвердження пароля')
			.find('input').type('TestPass1')
		// text
		cy.get('[data-cy=toggle-pass-confirm-visibility]').click()
		cy.contains('div', 'Підтвердження пароля')
			.find('input').should('have.attr', 'type', 'text' )
		// password confirmation
		cy.get('[data-cy=toggle-pass-confirm-visibility]').click()
		cy.contains('div', 'Підтвердження пароля')
			.find('input').should('have.attr', 'type', 'password' )
	})

	it('shows an error if password is too short', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('Test').blur()
		cy.contains('Мінімум 8 символів')
	})

	it('shows an error if password is too weak', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('weakpass').blur()
		cy.contains('Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число.')
	})

	it('shows an error if password doesn\'t contain at least one uppercase letter and a number', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('weakpass1').blur()
		cy.contains('Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число.')
	})

	it('validates strong password correctly', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('Strongpass1').blur()
		cy.contains('Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число.')
			.should('not.exist')
	})

	// password confirmation input
	it('shows an error if passwords doesn\'t match', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('TestPass1').blur()

		cy.contains('div', 'Підтвердження пароля')
			.find('input').type('TestPass2').blur()
		cy.contains('Обидва паролі повинні бути однаковими')
	})

	it('correctly validates matching passwords', function() {
		cy.contains('div', 'Ваш пароль')
			.find('input').type('TestPass1').blur()

		cy.contains('div', 'Підтвердження пароля')
			.find('input').type('TestPass1').blur()
		cy.contains('Обидва паролі повинні бути однаковими')
			.should('not.exist')
	})

	// correctly filled form
	it('can be filled', function() {
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').type('register@example.com')
			.should('have.value', 'register@example.com')

		cy.contains('div', 'Ваше ім\'я')
			.find('input').type('Newly')
			.should('have.value', 'Newly')

		cy.contains('div', 'По батькові')
			.find('input').type('Registered')
			.should('have.value', 'Registered')

		cy.contains('div', 'Прізвище')
			.find('input').type('User')
			.should('have.value', 'User')

		cy.contains('div', 'Ваш пароль')
			.find('input').type('TestPassword1')
			.should('have.value', 'TestPassword1')

		cy.contains('div', 'Підтвердження пароля')
			.find('input').type('TestPassword1')
			.should('have.value', 'TestPassword1')

		cy.contains('div', 'Я погоджуюся з умовами використання сайту')
			.find('[type="checkbox"]').check({ force: true })
			.should('be.checked')
	})
})
