import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../../../components/forms/LoginForm'
import store from '../../../store'

const mockHandleLogin = jest.fn()

describe('<LoginForm /> component', () => {
	let emailInput
	let passwordInput
	let button

	beforeEach(() => {
		render(
			<Provider store={store}>
				<Router>
					<LoginForm
						handleLogin={mockHandleLogin}
						processing={false}
						score={0}
					/>
				</Router>
			</Provider>
		)

		emailInput = screen.getByRole('textbox', { name: /Ваша електронна пошта/ })
		passwordInput = screen.getByLabelText(/Ваш пароль/)
		button = screen.getByRole('button', { name: /Вхід/ })
	})

	it('renders correctly', () => {
		expect(emailInput).toHaveAttribute('type', 'email')
		expect(passwordInput).toHaveAttribute('type', 'password')
		expect(button).toHaveAttribute('type', 'submit')
		expect(button).toBeEnabled()
		expect(screen.getByRole('link', { name: /Реєстрація/ }))
			.toHaveAttribute('href', '/register')
		expect(screen.getByRole('link', { name: /Відновлення паролю/ }))
			.toHaveAttribute('href', '/recover')
	})

	it('inputs can by filled correctly', () => {
		userEvent.type(emailInput, 'test@example.com')
		expect(emailInput.value).toBe('test@example.com')

		userEvent.type(passwordInput, 'TestPass1')
		expect(passwordInput.value).toBe('TestPass1')
	})

	it('email field shows error on invalid input', async () => {
		userEvent.type(emailInput, 'test')
		await waitFor(() => {
			expect(screen.getByText(/Адреса електронної пошти недійсна/i))
				.toBeInTheDocument()
		})
	})

	it('password field shows error on onvalid input', async () => {
		userEvent.type(passwordInput, 'testpass')
		await waitFor(() => {
			expect(screen
				.getByText(/Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число/i))
				.toBeInTheDocument()
		})
	})

	it('shows errors if trying to login with an empty form', async () => {
		userEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText(/Введіть свою електронну пошту/)).toBeInTheDocument()
			expect(screen.getByText(/Будь ласка, введіть свій пароль/)).toBeInTheDocument()
		})
	})

})
