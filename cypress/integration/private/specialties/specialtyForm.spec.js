describe('Specialty form', function() {
	before(function() {
		cy.login()
		cy.visit('/school/specialties')
		cy.contains('Додати новій фах').click()
	})

	it('can be opened', function() {
		cy.contains('Повна назва спеціальності')
		cy.contains('Вартість навчання за місяць')
		cy.contains('Додаткова інформація/опис')
		cy.contains('Додати')
	})

	it('specialty name input field shows an error on invalid input', function() {
		cy.contains('div', 'Повна назва спеціальності')
			.find('input').click().blur()
		cy.contains('Введіть повну назву спеціальності')

		cy.contains('div', 'Повна назва спеціальності')
			.find('input').type('S').blur()
		cy.contains('Не менш 2 символів')
	})

	it('specialty cost input field shows an error on invalid input', function() {
		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').click().blur()
		cy.contains('Обов\'язкове поле')

		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').type('10000').blur()
		cy.contains('Не більше 9999 грн')

		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').clear().type('-1')
		cy.contains('Повинно бути більше нуля')

		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').clear().type('3.4')
		cy.contains('Повинно бути цілим числом')

		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').clear().type('cost')
		cy.contains('Повинно бути числом')
	})

	it('additional input field show errors on invalid input', function() {
		cy.contains('div', 'Додаткова інформація/опис')
			.find('textarea').type('aa').blur()
		cy.contains('Не менш 3 символів')

		// 256 chars input
		cy.contains('div', 'Додаткова інформація/опис')
			.find('textarea').type(`Nam quis nulla. Integer malesuada. In in enim a arcu
			imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie,
			porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id
			velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi`).blur()
		cy.contains('Максимум 255 символів')
	})

	it('correctly clears all input on "clear" button press', function() {
		cy.contains('div', 'Повна назва спеціальності')
			.find('input').type('Spec name')
		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').type('200')
		cy.contains('div', 'Додаткова інформація/опис')
			.find('textarea').type('Some additional info')

		cy.contains('Очистити').click()

		cy.contains('div', 'Повна назва спеціальності')
			.find('input').should('not.have.value')
		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').should('not.have.value')
		cy.contains('div', 'Додаткова інформація/опис')
			.find('textarea').should('not.have.value')
	})

	it('correctly clears all errors on "clear" button press', function() {
		cy.get('[data-cy=add-specialty-btn]').click()
		cy.contains('Введіть повну назву спеціальності')
		cy.contains('Обов\'язкове поле')

		cy.contains('Очистити').click()

		cy.contains('Введіть повну назву спеціальності').should('not.exist')
		cy.contains('Обов\'язкове поле').should('not.exist')
	})
})