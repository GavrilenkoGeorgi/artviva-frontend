import React from 'react'
import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from '../../../components/forms/ContactForm'
import { thirtyOneCharacter, twoHundredAndEightyOneCharacters } from '../../../__mocks__/strings'

const mockHandleContactMessage = jest.fn()
const testValues = {
	name: 'Joe Doe',
	email: 'test@example.com',
	message: 'Test message'
}

describe('<ContactForm /> component', () => {
	let contactForm
	let nameInput
	let emailInput
	let messageInput
	let button

	beforeEach(() => {
		contactForm = render(
			<ContactForm
				handleContactMessage={mockHandleContactMessage}
				processing={false}
				score={null}
			/>
		)

		nameInput = contactForm.getByRole('textbox', { name: /Ваше ім'я/ })
		emailInput = contactForm.getByRole('textbox', { name: /Ваша електронна пошта/ })
		messageInput = contactForm.getByRole('textbox', { name: /Ваше повідомлення/ })
		button = contactForm.getByRole('button', /Відправити/)
	})

	it('renders correctly', () => {
		expect(nameInput).toHaveAttribute('type', 'text')
		expect(emailInput).toHaveAttribute('type', 'email')
		expect(messageInput).toHaveAttribute('type', 'textarea')
		expect(button).toHaveAttribute('type', 'submit')
	})

	it('inputs can by filled correctly', () => {
		userEvent.type(nameInput, 'Joe Doe')
		expect(nameInput.value).toBe('Joe Doe')

		userEvent.type(emailInput, 'test@example.com')
		expect(emailInput.value).toBe('test@example.com')

		userEvent.type(messageInput, 'Test message')
		expect(messageInput.value).toBe('Test message')
	})

	it('name field shows errors on invalid input', async () => {
		userEvent.type(nameInput, 'A')
		await waitFor(() => {
			expect(contactForm.getByText(/Мінімум 2 символи/)).toBeInTheDocument()
		})

		userEvent.clear(nameInput)
		userEvent.type(nameInput, thirtyOneCharacter)
		await waitFor(() => {
			expect(contactForm.getByText(/Максимум 30 символів/)).toBeInTheDocument()
		})

		userEvent.clear(nameInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Введіть ваше ім'я/)).toBeInTheDocument()
		})
	})

	it('email field shows errors on invalid input', async () => {
		userEvent.type(emailInput, 'test')
		await waitFor(() => {
			expect(contactForm.getByText(/Адреса електронної пошти недійсна/)).toBeInTheDocument()
		})

		userEvent.clear(emailInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Введіть свою електронну пошту/)).toBeInTheDocument()
		})
	})

	it('message field shows errors on invalid input', async () => {
		userEvent.type(messageInput, 'Test')
		await waitFor(() => {
			expect(contactForm.getByText(/Мінімум 8 символів/)).toBeInTheDocument()
		})

		userEvent.clear(messageInput)
		userEvent.type(messageInput, twoHundredAndEightyOneCharacters)
		await waitFor(() => {
			expect(contactForm.getByText(/Максимум 280 символів/)).toBeInTheDocument()
		})

		userEvent.clear(messageInput)
		await waitFor(() => {
			expect(contactForm.getByText(/Будь ласка, введіть своє повідомлення/)).toBeInTheDocument()
		})
	})

	it('shows errors if trying to send an empty form', async () => {
		userEvent.click(button)

		await waitFor(() => {
			expect(contactForm.getByText(/Введіть ваше ім'я/)).toBeInTheDocument()
			expect(contactForm.getByText(/Введіть свою електронну пошту/)).toBeInTheDocument()
			expect(contactForm.getByText(/Будь ласка, введіть своє повідомлення/)).toBeInTheDocument()
		})
	})

	it('button doesn\'t submit empty form', () => {
		userEvent.click(button)
		expect(mockHandleContactMessage).toHaveBeenCalledTimes(0)
	})

	it('button is disabled if reCaptcha score it low', () => {
		const { rerender } = contactForm

		rerender(<ContactForm
			handleContactMessage={mockHandleContactMessage}
			processing={false}
			score={.1}
		/>)
		expect(button).toBeDisabled()
	})

	it('button shows spinner while processing form', () => {
		// this really a button test, not a form
		const { rerender } = contactForm

		rerender(<ContactForm
			handleContactMessage={mockHandleContactMessage}
			processing={true}
			score={.9}
		/>)
		expect(contactForm.getByTestId('loading-spinner')).toBeInTheDocument()
	})

	it('button submits form data', async () => {
		userEvent.type(nameInput, 'Joe Doe')
		userEvent.type(emailInput, 'test@example.com')
		userEvent.type(messageInput, 'Test message')
		userEvent.click(button)
		await waitFor(() => {
			expect(mockHandleContactMessage).toHaveBeenCalledTimes(1)
			expect(mockHandleContactMessage).toHaveBeenCalledWith({
				values: testValues,
				resetForm: expect.any(Function)
			})
		})
	})

})
