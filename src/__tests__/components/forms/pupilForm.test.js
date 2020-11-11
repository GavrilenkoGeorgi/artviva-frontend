import React from 'react'
import { Provider } from 'react-redux'
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import PupilForm from '../../../components/forms/PupilForm'
import store from '../../../store'

afterEach(cleanup)

describe('Login form', () => {
	let pupilForm

	beforeEach(() => {
		pupilForm = render(
			<Provider store={store}>
				<PupilForm />
			</Provider>
		)
	})

	it.only('renders correctly', () => {
		const { getByText, getByLabelText } = pupilForm
		expect(getByText('Дані/інформація про учня')).toBeInTheDocument()

		const nameInput = getByLabelText(/Ваше ім'я/)
		expect(nameInput).toHaveAttribute('type', 'text')

		const emailInput = getByLabelText(/Ваша електронна пошта/)
		expect(emailInput).toHaveAttribute('type', 'email')

		const messageInput = getByLabelText(/Ваше повідомлення/)
		expect(messageInput).toHaveAttribute('type', 'textarea')

		const button = getByText('Відправити')
		expect(button).toHaveAttribute('type', 'submit')
	})

})
