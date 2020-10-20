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

Cypress.Commands.add('createUser', () => {
	// reset test db
	cy.request('POST', '/api/testing/reset')
	// create new user
	cy.request({
		method: 'POST',
		url: '/api/users',
		body: {
			email: Cypress.env('email'),
			username: Cypress.env('username'),
			password: Cypress.env('password')
		}
	})
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
