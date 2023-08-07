describe('Adding new teacher through the form', () => {
	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.resetDb()
		cy.createSpecialties()
		cy.login()
	})

	it('form can be opened', function() {
		cy.visit('/')
		cy.contains('Школа').click()
		cy.contains('Вчительська').click()
		// duplicate link names on user screen (вчителі)
		cy.get('[data-cy=teachers-section]').click()
		cy.location('pathname').should('equal', '/school/teachers')
		cy.contains('Додати нового').click()
		cy.contains('Додати нового вчителя')
	})

	it('teacher profile can be edited', function() {
		cy.createTeachers()
		cy.visit('/school/teachers')
		cy.contains('John Tester Doe').click()
		cy.get('[data-cy=edit-teacher]').first().click()
		cy.contains('div', 'ПІБ (прізвище, ім’я і по батькові)')
			.find('input').first().type(' Updated')

		cy.contains('Зберегти').click()
		cy.contains('Зміни успішно збережено')
		cy.contains('John Tester Doe Updated')
	})

	it('form can be filled and teacher is added successfully', function() {
		cy.visit('/school/teachers')
		cy.contains('Додати нового').click()

		// fill the form
		// teacher name
		cy.contains('div', 'ПІБ (прізвище, ім’я і по батькові)')
			.find('input').first().type('Test Teacher')
		// specialty
		cy.get('[data-cy=specialties-0]').select('Java')
		// employment date defaults to today
		const today = new Date().toLocaleDateString('en-CA')
		cy.get('#employmentDate-input').should('have.value', today)
		// experience input
		cy.contains('div', 'Років')
			.find('input').first().type('1')
		cy.get('#months-input').type('1')
		cy.get('#days-input').type('1')
		cy.contains('Робочий стаж: 1 років 1 міс. 1 днів')
		// week workload
		cy.contains('div', 'Тижневе навантаження. Часів:')
			.find('input').first().type(36)
		// phone number
		cy.contains('div', 'Телефонний номер')
			.find('input').first().type('0501234567').should('have.value', '0501234567')
		// email
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
		// teacher category
		cy.get('#category-input').select('9')
		// qualification
		cy.get('#qualification-input').select('Немає кваліфікаціїной категорії')
		// teacher current job title
		cy.get('#teacherTitle-input').select('Немає педагогічного звання')
		// emlpoyee type
		cy.get('#employeeType-input').select('Сумісник')
		// science degree
		cy.get('#scienceDegree-input').select('Немає наукової ступені')

		cy.get('[data-cy=add-teacher-btn]').click()

		cy.contains('Новий вчітель був успішно додан')
	})
})