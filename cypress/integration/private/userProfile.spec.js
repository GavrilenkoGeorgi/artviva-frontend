describe('User profile', function() {
	before(function() {
		cy.resetDb()
		cy.createSpecialties()
	})

	beforeEach(function() {
		cy.login()
		cy.visit('/school')
		cy.contains('Профіль').click()
	})

	it('user can open own profile page', function() {
		cy.contains('a', 'Аккаунт').should('have.class', 'active')
	})

	it('user can open account edit form and change name', function() {
		cy.get('[data-cy=edit-user]').click()
		cy.contains('div', 'Ім\'я користувача')
			.find('input').should('have.value', 'Joe').type(' Updated')
		cy.contains('Зберегти').click()
		cy.contains('Інформація про користувача оновлена.')
		cy.contains('Joe Updated')
	})

	it('user can fill and save own teacher profile', function() {
		cy.contains('Редагувати').click()
		cy.contains('a', 'Редагувати').should('have.class', 'active')

		cy.contains('div', 'ПІБ (прізвище, ім’я і по батькові)')
			.find('input').first().type('Test Teacher')

		cy.get('[data-cy=specialties-0]').select('Java')

		// employment date defaults to today
		cy.get('#employmentDate-input').should('have.value', new Date().toLocaleDateString('en-CA'))

		cy.contains('div', 'Років')
			.find('input').first().type('1')
		cy.get('#months-input').type('1')
		cy.get('#days-input').type('1')

		cy.contains('Робочий стаж: 1 років 1 міс. 1 днів')

		cy.contains('div', 'Тижневе навантаження. Часів:')
			.find('input').first().type(36)
		// phone number
		cy.contains('div', 'Телефонний номер')
			.find('input').first().type('0501234567').should('have.value', '+38 (050) 123-45-67')
		// email
		// eslint-disable-next-line
		cy.contains('Контактна електронна пошта').scrollIntoView().wait(750)
		cy.contains('div', 'Контактна електронна пошта')
			.find('input').first().type('test@example.com')
		// residence
		cy.get('#residence-input').select('Село')
		// gender
		cy.get('#gender-input').select('Чоловіча')
		// marital status
		cy.get('#maritalStatus-input').select('Одружений')
		// date of birth
		cy.get('#dateOfBirth-input').type('1990-08-09')
		// university
		cy.contains('div', 'Навчальний заклад')
			.find('input').first().type('Some Uni')
		// education type
		cy.get('#educationType-input').select('Повна вища освіта')
		// education degree
		cy.get('#educationDegree-input').select('Магістр')
		// qualification
		cy.get('#qualification-input').select('Немає кваліфікаціїной категорії')
		// teacher current job title
		cy.get('#teacherTitle-input').select('Немає педагогічного звання')
		// eslint-disable-next-line
		cy.contains('Наукова ступінь').scrollIntoView().wait(750)
		// science degree
		cy.get('#scienceDegree-input').select('Немає наукової ступені')
		// teacher category
		cy.get('#category-input').select('9')
		// emlpoyee type
		cy.get('#employeeType-input').select('Сумісник')

		cy.contains('Додати').click()
		cy.contains('Зміни успішно збережено')
	})

	it('user can view saved profile changes', function() {
		// eslint-disable-next-line
		cy.contains('Дані вчителя').scrollIntoView().wait(750).click()
		cy.contains('a', 'Дані вчителя').should('have.class', 'active')
		cy.contains('Детальна інформація про вчителя')
	})

})