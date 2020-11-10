import React from 'react'
import { Provider } from 'react-redux'
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import ContactForm from '../../../components/forms/ContactForm'
import store from '../../../store'
import { thirtyOneCharacter, twoHundredAndEightyOneCharacters } from '../../../__mocks__/strings'

afterEach(cleanup)

describe('Login form', () => {
	let contactForm

	beforeEach(() => {
		contactForm = render(
			<Provider store={store}>
				<ContactForm />
			</Provider>
		)
	})

	it('renders correctly', () => {
		const { getByText, getByLabelText } = contactForm
		expect(getByText('Зворотній зв\'язок')).toBeInTheDocument()

		const nameInput = getByLabelText(/Ваше ім'я/)
		expect(nameInput).toHaveAttribute('type', 'text')

		const emailInput = getByLabelText(/Ваша електронна пошта/)
		expect(emailInput).toHaveAttribute('type', 'email')

		const messageInput = getByLabelText(/Ваше повідомлення/)
		expect(messageInput).toHaveAttribute('type', 'textarea')

		const button = getByText('Відправити')
		expect(button).toHaveAttribute('type', 'submit')
	})

	it('inputs can by filled correctly', () => {
		const emailInput = contactForm.getByLabelText(/Ваше ім'я/)
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
		expect(emailInput.value).toBe('test@example.com')

		const nameInput = contactForm.getByLabelText(/Ваша електронна пошта/)
		fireEvent.change(nameInput, { target: { value: 'Joe Doe' } })
		expect(emailInput.value).toBe('test@example.com')

		const messageInput = contactForm.getByLabelText(/Ваше повідомлення/)
		fireEvent.change(messageInput, { target: { value: 'Test' } })
		expect(messageInput.value).toBe('Test')
	})

	it('name field shows errors on invalid input', async () => {
		const nameInput = contactForm.getByLabelText(/Ваше ім'я/)
		fireEvent.change(nameInput, { target: { value: 'A' } })
		fireEvent.blur(nameInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Мінімум 2 символи/)).toBeInTheDocument()
		})

		fireEvent.change(nameInput, { target: { value: thirtyOneCharacter } })
		fireEvent.blur(nameInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Максимум 30 символів/)).toBeInTheDocument()
		})

		fireEvent.change(nameInput, { target: { value: '' } })
		fireEvent.blur(nameInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Ваше ім'я\?/)).toBeInTheDocument()
		})
	})

	it('email field shows errors on invalid input', async () => {
		const emailInput = contactForm.getByLabelText(/Ваша електронна пошта/)
		fireEvent.change(emailInput, { target: { value: 'test' } })
		fireEvent.blur(emailInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Адреса електронної пошти недійсна/)).toBeInTheDocument()
		})

		fireEvent.change(emailInput, { target: { value: '' } })
		fireEvent.blur(emailInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Введіть свою електронну пошту/)).toBeInTheDocument()
		})
	})

	it('message field shows errors on invalid input', async () => {
		const messageInput = contactForm.getByLabelText(/Ваше повідомлення/)
		fireEvent.change(messageInput, { target: { value: 'Test' } })
		fireEvent.blur(messageInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Мінімум 8 символів/)).toBeInTheDocument()
		})

		fireEvent.change(messageInput, { target: { value: twoHundredAndEightyOneCharacters } })
		fireEvent.blur(messageInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Максимум 280 символів/)).toBeInTheDocument()
		})

		fireEvent.change(messageInput, { target: { value: '' } })
		fireEvent.blur(messageInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Будь ласка, введіть своє повідомлення/)).toBeInTheDocument()
		})
	})

	it('shows errors if trying to send an empty form', async () => {
		fireEvent.click(contactForm.getByText('Відправити'))

		await waitFor(() => {
			expect(contactForm.getByText(/Ваше ім'я\?/)).toBeInTheDocument()
			expect(contactForm.getByText(/Введіть свою електронну пошту/)).toBeInTheDocument()
			expect(contactForm.getByText(/Будь ласка, введіть своє повідомлення/)).toBeInTheDocument()
		})
	})

})
