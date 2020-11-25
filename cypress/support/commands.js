// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import '@testing-library/cypress/add-commands'

Cypress.Commands.add('resetDb', () => {
	cy.request('POST', '/api/testing/reset')
})

Cypress.Commands.add('createTeachers', () => {
	// create test teachers
	cy.request('POST', '/api/testing/create/teachers')
})

Cypress.Commands.add('createSpecialties', () => {
	// create test specialties
	cy.request('POST', '/api/testing/create/specialties')
})

Cypress.Commands.add('createPupils', () => {
	// create test pupils
	cy.request('POST', '/api/testing/create/pupils')
})

Cypress.Commands.add('createDefaultState', () => {
	// create default test DB state
	cy.request('POST', '/api/testing/create/defaultState')
})

Cypress.Commands.add('login', () => {
	cy.request({
		method: 'POST',
		url: 'http://localhost:3000/api/login',
		body: {
			email: Cypress.env('email'),
			password: Cypress.env('password'),
		}
	})
		.then((resp) => {
			window.localStorage.setItem('loggedUserJSON', JSON.stringify(resp.body))
		})
})

Cypress.Commands.add('createBlog', () => {
	const user = JSON.parse(window.localStorage.getItem('loggedUserJSON'))
	cy.request({
		method: 'POST',
		url: 'http://localhost:3000/api/blogs',
		body: {
			title: Cypress.env('blogTitle'),
			author: Cypress.env('blogAuthor'),
			url: Cypress.env('blogUrl')
		},
		auth: {
			bearer: user.token
		}
	})
})
