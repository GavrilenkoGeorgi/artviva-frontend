describe('Public apply form', function() {
	it('pupil can be added successfully', function() {
		cy.resetDb()
		cy.createSpecialties()
		cy.visit('/apply')

		cy.contains('div', 'Прізвище та повне ім\'я учня')
			.find('input').first().type('Test Pupil')

		cy.contains('div', 'Фах')
			.find('select').first().select('Java')

		cy.contains('div', 'Стать')
			.find('select').first().select('Чоловіча')

		cy.contains('div', 'Дата народження')
			.find('input').first().type('1990-08-09')

		cy.contains('div', 'Клас ЗОШ')
			.find('select').first().select('1')

		cy.contains('div', 'Пільги %')
			.find('select').first().select('50')

		cy.contains('div', 'В якому закладі навчается')
			.find('input').first().type('Elementary school')

		cy.contains('div', 'Домашня адреса')
			.find('input').first().type('Main street, 6')

		cy.contains('div', 'Телефонний номер учня')
			.find('input').first().type('0501234567')
			.should('have.value', '+38 (050) 123-45-67')

		cy.contains('div', 'Ім\'я особи, яка звертається із заявою')
			.find('input').first().type('Pupils Father')

		// eslint-disable-next-line
		cy.contains('Контактна електронна пошта').scrollIntoView().wait(750)

		cy.contains('div', 'Контактна електронна пошта')
			.find('input').first().type('email@example.com')

		cy.contains('div', 'Ім\'я батька')
			.find('input').first().type('Pupils Father')

		cy.contains('div', 'Телефонний номер батька')
			.find('input').first().type('0501234567')
			.should('have.value', '+38 (050) 123-45-67')

		cy.contains('div', 'Місце роботи батька')
			.find('input').first().type('Construction site')

		cy.contains('div', 'Ім\'я матері')
			.find('input').first().type('Pupils Mother')

		cy.contains('div', 'Телефонний номер матері')
			.find('input').first().type('0501234567')
			.should('have.value', '+38 (050) 123-45-67')

		cy.contains('div', 'Місце роботи матері')
			.find('input').first().type('Hospital')

		cy.contains('div', 'Я зобов\'язаний надати ці документи адміністрації школи')
			.find('[type="checkbox"]').first().check({ force: true })

		cy.contains('div', 'Я згоден на збір та обробку моїх персональних даних')
			.find('[type="checkbox"]').first().check({ force: true })

		cy.contains('div', 'Зобов\'язання про оплату')
			.find('[type="checkbox"]').first().check({ force: true })

		cy.contains('Відправити').click()

		cy.contains('Ваша заявка була прийнята, дякуємо вам!')
		cy.location('pathname').should('equal', '/apply/success')
	})
})
