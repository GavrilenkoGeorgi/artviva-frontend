describe('Pupil routines', function() {
	before(function() {
		cy.resetDb()
		cy.createDefaultState()
	})

	beforeEach(function() {
		cy.login()
		cy.visit('/school/pupils')
		cy.contains('div', 'First Test Pupil').click()
			// eslint-disable-next-line
			.within($div => {
				cy.get('[data-cy=show-info-pupil]').click()
			})
	})

	it('pupil details page can be opened', function() {
		cy.contains('Детали учня')
	})

	it('pupil f-1 form can be viewed', function() {
		cy.contains('Форма Ф-1').click()

		cy.contains('Заява')
		cy.contains('Завантажити форму First Test Pupil Ф-1.pdf')
	})

	it('delete modal can be opened and closed', function() {
		cy.get('[data-cy=delete-pupil]').click()
		cy.contains('Видалити учня?')

		cy.contains('Скасуваті').click()
		cy.contains('Видалити учня?').should('not.exist')
	})

	it('delete entity button is initially disabled', function() {
		cy.get('[data-cy=delete-pupil]').click()
		cy.get('[data-cy=delete-entity-btn]').should('be.disabled')
	})

	it('delete entity button becomes active on valid input', function() {
		cy.get('[data-cy=delete-pupil]').click()
		cy.contains('div', 'підтвердити видалення')
			.find('input').type('First Test Pupil')
		cy.get('[data-cy=delete-entity-btn]').should('be.enabled')
	})

})