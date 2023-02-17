import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import store from '../store'
// import axiosMock from 'axios'
// import mockSpecialtiesData from '../fixtures/specialties'

import App from '../App'
import user from '../fixtures/user.json'

// eslint-disable-next-line
global.scrollTo = jest.fn()

describe('Artiva main page', () => {
	beforeEach(() => {
		// axiosMock.get.mockResolvedValue({ data: mockSpecialtiesData })

		render(
			<Provider store={store}>
				<App />
			</Provider>
		)
	})

	it('renders correctly', () => {
		expect(screen.getByText('Школа мистецтв'))
			.toBeInTheDocument()
	})

	it('when no user is logged in, login button is present', async () => {
		const button = screen.getByRole('button', { name: 'Школа' })
		userEvent.click(button)

		expect(screen.getByText('Вхід')).toBeInTheDocument()
	})

})

describe('when user is logged in', () => {
	beforeEach(() => {
		window.localStorage.setItem(
			'loggedUserJSON', JSON.stringify(user)
		)
		store.user = user

		render(
			<Provider store={store}>
				<App />
			</Provider>
		)
	})

	it('logout button is present', () => {
		userEvent.click(screen.getByRole('button', { name: 'Школа' }))

		expect(screen.getByText('Вийти')).toBeInTheDocument()
	})

	it('user can logout', () => {
		userEvent.click(screen.getByRole('button', { name: 'Школа' }))
		userEvent.click(screen.getAllByText('Вийти')[0])

		expect(window.localStorage.getItem('loggedUserJSON')).toBe(undefined)
	})
})
