import React from 'react'
import { Provider } from 'react-redux'
import { render, fireEvent, cleanup } from '@testing-library/react'
import App from '../App'
import store from '../store'
import user from '../__mocks__/testUser'
// eslint-disable-next-line
global.scrollTo = jest.fn()

afterEach(cleanup)

describe('Artiva main page', () => {
	it('renders main page correctly', () => {
		const { getByText } = render(
			<Provider store={store}>
				<App />
			</Provider>
		)
		expect(getByText(/ArtViva — дитяча школа мистецтв/i)).toBeInTheDocument()
	})

	it('when no user is logged in, login button is present', async () => {
		const { container, getByText } = render(
			<Provider store={store}>
				<App />
			</Provider>
		)
		fireEvent.click(getByText('Школа'))
		expect(container).toHaveTextContent('Вхід')
	})

	describe('when user is logged in', () => {
		let app = undefined
		beforeEach(() => {
			window.localStorage.setItem(
				'loggedUserJSON', JSON.stringify(user)
			)
			store.user = user

			app = render(
				<Provider store={store}>
					<App />
				</Provider>
			)
		})

		it('logout button is present', () => {
			fireEvent.click(app.getByText('Школа'))
			expect(app.container).toHaveTextContent('Вийти')
		})

		it('user can logout', () => {
			fireEvent.click(app.getByText('Школа'))
			fireEvent.click(app.getByText('Вийти'))
			expect(window.localStorage.getItem('loggedUserJSON')).toBe(undefined)
		})
	})
})
