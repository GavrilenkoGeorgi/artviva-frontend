// eslint-disable-next-line
const oneHundredTwentyNineChars = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque pena'

describe('Public apply form', function() {
	before(function() {
		cy.resetDb()
		cy.createSpecialties()
	})

	beforeEach(function() {
		cy.intercept('/api/specialties', { fixture: 'specialties.json' })
		cy.login()
		cy.visit('/school/pupils')
		cy.contains('Додати нового').click()
	})

	it('can be opened', function() {
		cy.contains('Додати нового учня')
		cy.contains('Наразі цей учень ще не призначений жодному вчителю')
	})

	it('pupil "assigned to" field shows an error on invalid input', function() {
		cy.get('.modal-content').within(() => {
			cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
				.find('input').type('test').blur()
			cy.contains(/Шукайте за прізвищем користувача/)
		})
	})

	it('pupil name field shows an error on invalid input', function() {
		cy.get('.modal-content').within(() => {
			cy.contains('div', 'Прізвище та повне ім\'я учня')
				.find('input').type('a').blur()
			cy.contains('Не менш 2 символів')

			cy.contains('div', 'Прізвище та повне ім\'я учня')
				.find('input').clear().type(oneHundredTwentyNineChars).blur()
			cy.contains('Максимум 128 символів')
		})
	})

	it('can be filled', function() {
		cy.get('.modal-content').within(() => {
			cy.contains('div', 'Електронна адреса користувача, якому призначено цього учня')
				.find('input').type('test@example.com')
				.should('have.value', 'test@example.com')

			cy.contains('div', 'Прізвище та повне ім\'я учня')
				.find('input').type('Test Pupil')
				.should('have.value', 'Test Pupil')

			cy.contains('div', 'Фах')
				.find('select').select('Java')
				.should('have.value', 'Java')

			cy.contains('div', 'Стать')
				.find('select').select('Чоловіча')
				.should('have.value', 'Чоловіча')

			cy.contains('div', 'Дата народження')
				.find('input').type('1990-08-09')
				.should('have.value', '1990-08-09')

			cy.contains('div', 'Клас ЗОШ')
				.find('select').select('1')
				.should('have.value', '1')

			cy.contains('div', 'Пільги %')
				.find('select').select('50')
				.should('have.value', '50')

			cy.contains('div', 'В якому закладі навчается')
				.find('input').type('Elementary school')
				.should('have.value', 'Elementary school')

			cy.contains('div', 'Домашня адреса')
				.find('input').type('Main street, 6')
				.should('have.value', 'Main street, 6')

			cy.contains('div', 'Телефонний номер учня')
				.find('input').type('0501234567')
				.should('have.value', '0501234567')

			cy.contains('div', 'Ім\'я особи, яка звертається із заявою')
				.find('input').type('Pupils Father')
				.should('have.value', 'Pupils Father')

			cy.contains('div', 'Контактна електронна пошта')
				.find('input').type('email@example.com')
				.should('have.value', 'email@example.com')

			cy.contains('div', 'Ім\'я батька')
				.find('input').type('Pupils Father')
				.should('have.value', 'Pupils Father')

			cy.contains('div', 'Телефонний номер батька')
				.find('input').type('0501234567')
				.should('have.value', '0501234567')

			cy.contains('div', 'Місце роботи батька')
				.find('input').type('Construction site')
				.should('have.value', 'Construction site')

			cy.contains('div', 'Ім\'я матері')
				.find('input').type('Pupils Mother')
				.should('have.value', 'Pupils Mother')

			cy.contains('div', 'Телефонний номер матері')
				.find('input').type('0501234567')
				.should('have.value', '0501234567')

			cy.contains('div', 'Місце роботи матері')
				.find('input').type('Hospital')
				.should('have.value', 'Hospital')

			// forced cause somehow they get 'hidden' behind the
			// bootstrap custom checkbox label (
			cy.contains('div', 'Надав усі необхідні документи')
				.find('[type="checkbox"]').check({ force: true })

			cy.contains('div', 'Навчається')
				.find('[type="checkbox"]').check({ force: true })

			cy.contains('div', 'Випустився зі школи')
				.find('[type="checkbox"]').check({ force: true })

			cy.contains('div', 'Відрахований зі школи')
				.find('[type="checkbox"]').check({ force: true })

			cy.contains('div', 'Додаткова інформація/опис')
				.find('textarea').type('Some additional info')
				.should('have.value', 'Some additional info')
		})
	})

})
