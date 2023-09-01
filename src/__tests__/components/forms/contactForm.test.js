import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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
	let view
	let nameInput
	let emailInput
	let messageInput
	let button

	beforeEach(() => {
		view = render(
			<ContactForm
				handleContactMessage={mockHandleContactMessage}
				processing={false}
				score={0}
			/>
		)

		nameInput = screen.getByRole('textbox', { name: /Ім'я/ })
		emailInput = screen.getByRole('textbox', { name: /Ваша електронна пошта/ })
		messageInput = screen.getByRole('textbox', { name: /Повідомлення/ })
		button = screen.getByRole('button', /Відправити/)
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
			expect(screen.getByText(/Мінімум 2 символи/)).toBeInTheDocument()
		})

		userEvent.clear(nameInput)
		userEvent.type(nameInput, thirtyOneCharacter)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 30 символів/)).toBeInTheDocument()
		})

		userEvent.clear(nameInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть ваше ім'я/)).toBeInTheDocument()
		})
	})

	it('email field shows errors on invalid input', async () => {
		userEvent.type(emailInput, 'test')
		await waitFor(() => {
			expect(screen.getByText(/Адреса електронної пошти недійсна/)).toBeInTheDocument()
		})

		userEvent.clear(emailInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть електронну пошту/)).toBeInTheDocument()
		})
	})

	it('message field shows errors on invalid input', async () => {
		userEvent.type(messageInput, 'Test')
		await waitFor(() => {
			expect(screen.getByText(/Мінімум 8 символів/)).toBeInTheDocument()
		})

		userEvent.clear(messageInput)
		userEvent.type(messageInput, twoHundredAndEightyOneCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 280 символів/)).toBeInTheDocument()
		})

		userEvent.clear(messageInput)
		await waitFor(() => {
			expect(screen.getByText(/Будь ласка, введіть своє повідомлення/)).toBeInTheDocument()
		})
	})

	it('shows errors if trying to send an empty form', async () => {
		userEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText(/Введіть ваше ім'я/)).toBeInTheDocument()
			expect(screen.getByText(/Введіть електронну пошту/)).toBeInTheDocument()
			expect(screen.getByText(/Будь ласка, введіть своє повідомлення/)).toBeInTheDocument()
		})
	})

	it('button doesn\'t submit empty form', () => {
		userEvent.click(button)
		expect(mockHandleContactMessage).toHaveBeenCalledTimes(0)
	})

	it('button is disabled if reCaptcha score it low', () => {
		const { rerender } = view

		rerender(<ContactForm
			handleContactMessage={mockHandleContactMessage}
			processing={false}
			score={.1}
		/>)
		expect(button).toBeDisabled()
	})

	it('button shows spinner while processing form', () => {
		// this really a button test, not a form
		const { rerender } = view

		rerender(<ContactForm
			handleContactMessage={mockHandleContactMessage}
			processing={true}
			score={.9}
		/>)
		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
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
