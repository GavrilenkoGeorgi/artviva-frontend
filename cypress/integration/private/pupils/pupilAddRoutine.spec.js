describe('Pupil routines', function() {
	beforeEach(function() {
		cy.resetDb()
		cy.createSpecialties()
		cy.login()
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.visit('/school')
	})

	it('new pupil can be added', function() {
		cy.contains('Учні').click()
		cy.contains('Додати нового').click()

		cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
			// 1. get list of users for validation
			// 2. enter needed email by hand
			// somehow cypress won't select from datalist
			.find('input').type('Doe').clear().type('test@example.com')

		cy.contains('div', 'Прізвище та повне ім\'я учня')
			.find('input').type('Test Pupil One')

		cy.contains('div', 'Фах')
			.find('select').select('Java')

		// modal input conflicts with filter input
		cy.get('#gender-input').select('Чоловіча')

		cy.contains('div', 'Дата народження')
			.find('input').type('1990-08-09')

		cy.contains('div', 'Клас ЗОШ')
			.find('select').select('1')

		// modal input conflicts with filter input
		cy.get('#hasBenefit-input')
			.select('50')

		cy.contains('div', 'В якому закладі навчается')
			.find('input').type('Elementary school')

		cy.contains('div', 'Домашня адреса')
			.find('input').type('Main street, 6')

		cy.contains('div', 'Телефонний номер учня')
			.find('input').type('0501234567')
			.should('have.value', '+38 (050) 123-45-67')

		cy.contains('div', 'Ім\'я особи, яка звертається із заявою')
			.find('input').type('Pupils Father')

		cy.contains('div', 'Контактна електронна пошта')
			.find('input').type('email@example.com')

		cy.contains('div', 'Ім\'я батька')
			.find('input').type('Pupils Father')

		cy.contains('div', 'Телефонний номер батька')
			.find('input').type('0501234567')
			.should('have.value', '+38 (050) 123-45-67')

		cy.contains('div', 'Місце роботи батька')
			.find('input').type('Construction site')

		cy.contains('div', 'Ім\'я матері')
			.find('input').type('Pupils Mother')

		cy.contains('div', 'Телефонний номер матері')
			.find('input').type('0501234567')
			.should('have.value', '+38 (050) 123-45-67')

		cy.contains('div', 'Місце роботи матері')
			.find('input').type('Hospital')

		cy.contains('div', 'Надав усі необхідні документи')
			.find('[type="checkbox"]').check({ force: true })

		cy.get('[data-cy=currently-enrolled-checkbox]')
			.check({ force: true })

		cy.get('[data-cy=graduated-checkbox]')
			.check({ force: true })

		cy.get('[data-cy=suspended-checkbox]')
			.check({ force: true })

		cy.contains('div', 'Додаткова інформація/опис')
			.find('textarea').type('Some info')

		cy.get('[data-cy=add-pupil-btn]').click()

		cy.contains('Новий учень був успішно додан')
	})
})