describe('Teacher filter', function() {
	before(function() {
		cy.resetDb()
		cy.createSpecialties()
		cy.createTeachers()
	})

	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.login()
		cy.visit('/school/teachers')
	})

	it('filters by name', function() {
		cy.get('[data-cy=name-filter-input]').type('John')

		cy.contains('Mary Tester Doe').should('not.exist')
		cy.contains('Загалом: 1')
	})

	it('correctly resets all filters', function() {
		cy.get('[data-cy=name-filter-input]').type('Mary')

		cy.contains('John Tester Doe').should('not.exist')
		cy.contains('Показати всіх').click()
		cy.contains('Загалом: 2')
		cy.contains('Не вибрано жодного фільтру')
	})

	it('more filters toggler shows and hides additional filters', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('Стаж років').should('be.visible')

		cy.contains('Більше фільтрів').click()
		cy.contains('Стаж років').should('not.be.visible')
	})

	it('filters by age', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Вік років')
			.parent('div').find('input').first().clear().type('35')

		cy.contains('div', 'Вік років')
			.parent('div').find('input').last().clear().type('45')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by years of experience', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Стаж років')
			.parent('div').find('input').first().type('1')

		cy.contains('div', 'Стаж років')
			.parent('div').find('input').last().type('10')
		cy.contains('John Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by retirement status', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Пенсіонер?')
			.find('select').select('На пенсії')

		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by student status', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Студент?')
			.find('select').select('Не навчается')

		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by gender', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Стать')
			.find('select').select('Чоловіча')
		cy.contains('John Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by qualification category', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Кваліфікаційна категорія')
			.find('select').select('Вища категорія')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by education type', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Освітній рівень')
			.find('select').select('Повна вища освіта')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by education degree', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Освітньо-кваліфікаційний рівень')
			.find('select').select('Магістр')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by category level', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Розряд')
			.find('select').select('9')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by teacher title', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Педагогічне звання')
			.find('select').select('Старший викладач')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by employee type', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Тип співробітника')
			.find('select').select('Штатний співробітник')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by residency type', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Місцевість проживання')
			.find('select').select('Місто')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by marital status', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Сімейний стан')
			.find('select').select('Не одружений')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})

	it('filters by science degree', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Наукова ступинь')
			.find('select').select('Доктор наук')
		cy.contains('Mary Tester Doe')
		cy.contains('Загалом: 1')
	})
})