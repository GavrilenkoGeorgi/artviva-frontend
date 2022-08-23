describe('Specialties routines', function() {
	before(function() {
		cy.resetDb()
		cy.createDefaultState()
	})

	beforeEach(function() {
		cy.login()
		cy.visit('/school/specialties')
	})

	it('list can be viewed', function() {
		cy.contains('Список усіх спеціальностей школи')
	})

	it('specialty details can be edited', function() {
		cy.contains('div', 'Basic programming language').click()
		cy.get('[data-cy=edit-specialty]').first().click()
		cy.contains('div', 'Повна назва спеціальності')
			.find('input').clear({ force: true }).type('Renamed spec', { force: true })
		cy.contains('Зберегти').click()
		cy.contains('Зміни успішно збережено')
	})

	it('new specialty can be added', function() {
		cy.contains('Додати новій фах').click()

		cy.contains('div', 'Повна назва спеціальності')
			.find('input').type('Newly added spec')

		cy.contains('div', 'Вартість навчання за місяць')
			.find('input').type('500')

		cy.contains('div', 'Додаткова інформація/опис')
			.find('textarea').type('Some additional info')

		cy.get('[data-cy=add-specialty-btn]').click()
		cy.contains('Нова спеціальність була успішно додана')
		cy.contains('Newly added spec')

		// check if it is visible on the public prices page
		cy.visit('/prices')
		cy.contains('Newly added spec')
	})
})