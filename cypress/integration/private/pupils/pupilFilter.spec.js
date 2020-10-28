describe('Pupil filter', function() {
	before(function() {
		cy.resetDb()
		cy.createPupils()
	})

	beforeEach(function() {
		cy.login()
		cy.visit('/school/pupils')
	})

	it('filters by pupils name', function() {
		cy.get('[data-cy=name-filter-input]').type('Second')
		cy.contains('First Test Pupil').should('not.exist')
		cy.contains('Загалом: 1')
	})

	it('filters by pupils specialty', function() {
		cy.get('[data-cy=specialty-filter-input]').type('Java')
		cy.contains('First Test Pupil').should('not.exist')
		cy.contains('Загалом: 1')
	})

	it('correctly resets all filters', function() {
		cy.get('[data-cy=name-filter-input]').type('First')
		cy.contains('Second Test Pupil').should('not.exist')

		cy.contains('Показати всіх').click()
		cy.contains('Загалом: 2')
		cy.contains('Не вибрано жодного фільтру')
	})

	it('shows more filters', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('Пільги %')
	})

	it('correctly filters by docs presence', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Документи?')
			.find('select').select('Надали усі документи')

		cy.contains('Загалом: 1')
		cy.contains('First Test Pupil')
	})

	it('correctly filters by enrolled status', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Навчається?')
			.find('select').select('Зараз навчаються')

		cy.contains('Загалом: 1')
		cy.contains('First Test Pupil')
	})

	it('correctly filters by graduation status', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Випустився зі школи?')
			.find('select').select('Закінчили школу')

		cy.contains('Загалом: 1')
		cy.contains('Second Test Pupil')
	})

	it('correctly filters by suspended status', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Відрахований?')
			.find('select').select('Зараховані')

		cy.contains('Загалом: 1')
		cy.contains('Second Test Pupil')
	})

	it('correctly filters by gender', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Стать')
			.find('select').select('Чоловіча')

		cy.contains('Загалом: 1')
		cy.contains('First Test Pupil')
	})

	it('correctly filters by elementary school class', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Клас навчання в ЗОШ')
			.find('select').select('1')

		cy.contains('Загалом: 1')
		cy.contains('First Test Pupil')
	})

	it('correctly filters by benefits amount', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Пільги %')
			.find('select').select('50')

		cy.contains('Загалом: 1')
		cy.contains('Second Test Pupil')
	})

	it('correctly filters by art school class', function() {
		cy.contains('Більше фільтрів').click()
		cy.contains('div', 'Клас навчання в ДШМ')
			.find('select').select('2')

		cy.contains('Загалом: 1')
		cy.contains('Second Test Pupil')
	})
})
