import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import LoginForm from '../../../components/forms/LoginForm'
import store from '../../../store'

afterEach(cleanup)

describe('Login form', () => {
	let loginForm

	beforeEach(() => {
		loginForm = render(
			<Provider store={store}>
				<Router>
					<LoginForm />
				</Router>
			</Provider>
		)
	})

	it('renders correctly', () => {
		const { getByText, getByLabelText } = loginForm
		expect(getByText('Логін')).toBeInTheDocument()

		const emailInput = getByLabelText('Ваша електронна пошта')
		expect(emailInput).toHaveAttribute('type', 'email')

		const passwordInput = getByLabelText('Ваш пароль')
		expect(passwordInput).toHaveAttribute('type', 'password')

		const button = getByText('Вхід')
		expect(button).toHaveAttribute('type', 'submit')

		const registerNewUserLink = getByText('Реєстрація')
		expect(registerNewUserLink).toHaveAttribute('href', '/register')

		const recoverPasswordLink = getByText('Відновлення паролю')
		expect(recoverPasswordLink).toHaveAttribute('href', '/recover')
	})

	it('inputs can by filled correctly', () => {
		const emailInput = loginForm.getByLabelText('Ваша електронна пошта')
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
		expect(emailInput.value).toBe('test@example.com')

		const passwordInput = loginForm.getByLabelText('Ваш пароль')
		fireEvent.change(passwordInput, { target: { value: 'TestPass1' } })
		expect(passwordInput.value).toBe('TestPass1')
	})

	it('email field shows error on invalid input', async () => {
		const emailInput = loginForm.getByLabelText('Ваша електронна пошта')
		fireEvent.change(emailInput, { target: { value: 'test' } })
		fireEvent.blur(emailInput)
		await waitFor(() => {
			expect(loginForm.getByText(/Адреса електронної пошти недійсна/i)).toBeInTheDocument()
		})
	})

	it('password field shows error on onvalid input', async () => {
		const passwordInput = loginForm.getByLabelText('Ваш пароль')
		fireEvent.change(passwordInput, { target: { value: 'testpass' } })
		fireEvent.blur(passwordInput)
		await waitFor(() => {
			expect(loginForm
				.getByText(/Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число/i))
				.toBeInTheDocument()
		})
	})

})
