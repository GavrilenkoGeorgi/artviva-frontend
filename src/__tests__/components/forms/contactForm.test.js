import React from 'react'
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import ContactForm from '../../../components/forms/ContactForm'
import { thirtyOneCharacter, twoHundredAndEightyOneCharacters } from '../../../__mocks__/strings'

const mockHandleContactMessage = jest.fn()
const testValues = {
	name: 'Joe Doe',
	email: 'test@example.com',
	message: 'Test message'
}

afterEach(cleanup)

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

		nameInput = contactForm.getByLabelText(/Ваше ім'я/)
		emailInput = contactForm.getByLabelText(/Ваша електронна пошта/)
		messageInput = contactForm.getByLabelText(/Ваше повідомлення/)
		button = contactForm.getByText('Відправити')
	})

	it('renders correctly', () => {
		expect(nameInput).toHaveAttribute('type', 'text')
		expect(emailInput).toHaveAttribute('type', 'email')
		expect(messageInput).toHaveAttribute('type', 'textarea')
		expect(button).toHaveAttribute('type', 'submit')
	})

	it('inputs can by filled correctly', () => {
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
		expect(emailInput.value).toBe('test@example.com')

		fireEvent.change(nameInput, { target: { value: 'Joe Doe' } })
		expect(emailInput.value).toBe('test@example.com')

		fireEvent.change(messageInput, { target: { value: 'Test' } })
		expect(messageInput.value).toBe('Test')
	})

	it('name field shows errors on invalid input', async () => {
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
		fireEvent.click(button)

		await waitFor(() => {
			expect(contactForm.getByText(/Ваше ім'я\?/)).toBeInTheDocument()
			expect(contactForm.getByText(/Введіть свою електронну пошту/)).toBeInTheDocument()
			expect(contactForm.getByText(/Будь ласка, введіть своє повідомлення/)).toBeInTheDocument()
		})
	})

	it('button doesn\'t submit empty form', async () => {
		fireEvent.click(button)
		await waitFor(() => {
			expect(mockHandleContactMessage).toHaveBeenCalledTimes(0)
		})
	})

	it('button is disabled if reCaptcha score it low', () => {
		const { rerender } = contactForm

		rerender(<ContactForm
			handleContactMessage={mockHandleContactMessage}
			processing={false}
			score={.1}
		/>)
		expect(button).toHaveAttribute('disabled')
	})

	it('button shows spinner while processing form', async () => {
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
		fireEvent.change(nameInput, { target: { value: 'Joe Doe' } })
		fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
		fireEvent.change(messageInput, { target: { value: 'Test message' } })
		fireEvent.click(button)
		await waitFor(() => {
			expect(mockHandleContactMessage).toHaveBeenCalledTimes(1)
			expect(mockHandleContactMessage).toHaveBeenCalledWith({
				values: testValues,
				resetForm: expect.any(Function)
			})
		})
	})

})
