describe('Login logic', function () {
	before(function() {
		cy.resetDb()
	})

	beforeEach(() => {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
	})

	it('logs in using UI', function() {
		cy.visit('/login')
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').type(Cypress.env('email'))
		cy.contains('div', 'Ваш пароль')
			.find('input').type(Cypress.env('password'))
		cy.contains('Вхід').click()

		cy.location('pathname').should('equal', '/school')

		cy.contains('Школа для початківців')
			.should('be.visible')
			.then(() => {
				// global window
				const userString = window.localStorage.getItem('loggedUserJSON')
				expect(userString).to.be.a('string')
				const user = JSON.parse(userString)
				expect(user).to.be.an('object')
				expect(user).to.have.keys([
					'approvedUser',
					'email',
					'id',
					'isActive',
					'lastname',
					'middlename',
					'name',
					'superUser',
					'token'
				])
				expect(user.token).to.be.a('string')
			})
	})

	it('logs out using UI', function() {
		cy.login()
		cy.visit('/school')
		cy.contains('Школа').click()
		cy.contains('Вийти').click()
		cy.location('pathname').should('equal', '/')
			.then(() => {
				const userString = window.localStorage.getItem('loggedUserJSON')
				expect(userString).not.to.exist
			})
	})

	it('fails log in with invalid password', function() {
		cy.visit('/login')
		cy.contains('div', 'Ваша електронна пошта')
			.find('input').type(Cypress.env('email'))
		cy.contains('div', 'Ваш пароль')
			.find('input').type('InvalidPass1')
		cy.contains('Вхід').click()

		cy.contains('.alert-danger', 'Невірна адреса електронної пошти або пароль')
			.should('be.visible')
	})
})
