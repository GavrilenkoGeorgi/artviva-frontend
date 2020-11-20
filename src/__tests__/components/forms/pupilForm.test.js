import React from 'react'
import { Provider } from 'react-redux'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import store from '../../../store'
import moment from 'moment'
import PupilForm from '../../../components/forms/PupilForm'
import specialties from '../../../__mocks__/specialties.json'
import { oneHundredAndTwentyNineCharacters, twoHundredAndFiftySixCharacters } from '../../../__mocks__/strings'
import { genders, classNumbers, benefits } from '../../../__mocks__/formOptions'

const mockHandleFormData = jest.fn()
const mockOpenInfoModal = jest.fn()

describe('<PupilForm /> component', () => {
	const specOptions = specialties.map(spec => spec.title)
	// eslint-disable-next-line
	let view
	// inputs
	let nameInput
	let specialtyInput
	let genderInput
	let birthDateInput
	let mainSchoolClassInput
	let benefitsInput
	let mainSchoolInput
	let homeAddressInput
	let phoneNumberInput
	let applicantNameInput
	let contactEmailInput
	let fathersNameInput
	let fathersPhoneInput
	let fathersEmploymentInfoInput
	let mothersNameInput
	let mothersPhoneInput
	let mothersEmploymentInfoInput
	// checkboxes
	let docsCheck
	let processDataCheck
	let paymentObligationsCheck
	// buttons
	let submitButton
	let resetButton


	beforeEach(() => {
		view = render(
			<Provider store={store}>
				<PupilForm
					handleFormData={mockHandleFormData}
					openInfoModal={mockOpenInfoModal}
					specialties={specialties.map(spec => spec.title)}
					mode="public"
				/>
			</Provider>
		)

		nameInput = screen.getByRole('textbox', { name: /Прізвище та повне ім'я учня/ })
		specialtyInput = screen.getByRole('combobox', { name: /Фах/ })
		genderInput = screen.getByRole('combobox', { name: /Стать/ })
		birthDateInput = screen.getByLabelText(/Дата народження/)
		mainSchoolClassInput = screen.getByRole('combobox', { name: /Клас ЗОШ/ })
		benefitsInput = screen.getByRole('combobox', { name: /Пільги %/ })
		mainSchoolInput = screen.getByRole('textbox', { name: /В якому закладі навчается/ })
		homeAddressInput = screen.getByRole('textbox', { name: /Домашня адреса/ })
		phoneNumberInput = screen.getByRole('textbox', { name: /Телефонний номер учня/ })
		applicantNameInput = screen.getByRole('textbox', { name: /Ім'я особи, яка звертається із заявою/ })
		contactEmailInput = screen.getByRole('textbox', { name: /Контактна електронна пошта/ })

		fathersNameInput = screen.getByRole('textbox', { name: /Ім'я батька/ })
		fathersPhoneInput = screen.getByRole('textbox', { name: /Телефонний номер батька/ })
		fathersEmploymentInfoInput = screen.getByRole('textbox', { name: /Місце роботи батька/ })

		mothersNameInput = screen.getByRole('textbox', { name: /Ім'я матері/ })
		mothersPhoneInput = screen.getByRole('textbox', { name: /Телефонний номер матері/ })
		mothersEmploymentInfoInput = screen.getByRole('textbox', { name: /Місце роботи матері/ })

		docsCheck = screen.getByRole('checkbox', { name: /Я зобов'язаний надати ці документи/ })
		processDataCheck = screen.getByRole('checkbox', { name: /Я згоден на збір та обробку/ })
		paymentObligationsCheck = screen.getByRole('checkbox', { name: /Зобов'язання про оплату/ })

		submitButton = screen.getByRole('button', { name: /Відправити/ })
		resetButton = screen.getByRole('button', { name: /Очистити/ })
	})

	it('in renders all fields correctly', () => {
		expect(/Дані\/інформація про учня/).toBeInTheDocument
		expect(nameInput).toHaveAttribute('type', 'text')
		expect(specialtyInput).toHaveClass('custom-select')
		expect(genderInput).toHaveClass('custom-select')
		expect(birthDateInput).toHaveAttribute('type', 'date')
		expect(mainSchoolClassInput).toHaveClass('custom-select')
		expect(benefitsInput).toHaveClass('custom-select')
		expect(mainSchoolInput).toHaveAttribute('type', 'text')
		expect(homeAddressInput).toHaveAttribute('type', 'text')
		expect(phoneNumberInput).toHaveAttribute('type', 'text')
		expect(applicantNameInput).toHaveAttribute('type', 'text')
		expect(contactEmailInput).toHaveAttribute('type', 'email')

		expect(/Дані\/інформація о батьках/).toBeInTheDocument
		expect(fathersNameInput).toHaveAttribute('type', 'text')
		expect(fathersPhoneInput).toHaveAttribute('type', 'text')
		expect(fathersEmploymentInfoInput).toHaveAttribute('type', 'text')
		expect(mothersNameInput).toHaveAttribute('type', 'text')
		expect(mothersPhoneInput).toHaveAttribute('type', 'text')
		expect(mothersEmploymentInfoInput).toHaveAttribute('type', 'text')

		expect(docsCheck).toHaveAttribute('type', 'checkbox')
		expect(processDataCheck).toHaveAttribute('type', 'checkbox')
		expect(paymentObligationsCheck).toHaveAttribute('type', 'checkbox')

		expect(submitButton).toHaveAttribute('type', 'submit')
		expect(resetButton).toHaveAttribute('type', 'reset')
	})

	it('name input value can be changed', () => {
		// expect all inputs to be able to change their values on user input
		userEvent.type(nameInput, 'Joe Doe')
		expect(nameInput.value).toBe('Joe Doe')
	})

	it('name input shows errors on invalid input', async () => {
		userEvent.type(nameInput, 'J')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 2 символів/)).toBeInTheDocument()
		})

		userEvent.type(nameInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/)).toBeInTheDocument()
		})

		userEvent.clear(nameInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть прізвище та повне ім'я учня/)).toBeInTheDocument()
		})
	})

	it('specialty input value can be changed', () => {
		const [ firstOption ] = specOptions

		expect(specialtyInput).toHaveAttribute('options', specOptions.join())
		userEvent.selectOptions(specialtyInput, firstOption)
		expect(specialtyInput.value).toBe(firstOption)
	})

	it('specialty input shows error on empty input', async () => {
		userEvent.selectOptions(specialtyInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Виберіть фах/)).toBeInTheDocument()
		})
	})

	it('gender select value can be changed', () => {
		const [ gender ] = genders
		expect(genderInput).toHaveAttribute('options', genders.join())
		userEvent.selectOptions(genderInput, gender)
		expect(genderInput.value).toBe(gender)
	})

	it('gender select shows error on empty input', async () => {
		userEvent.selectOptions(genderInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Виберіть стать/)).toBeInTheDocument()
		})
	})

	it('birth date input value can be changed', async () => {
		const date = moment().subtract(5, 'years').format('YYYY-MM-DD')
		fireEvent.change(birthDateInput, { target: { value: date } })
		await waitFor(() => {
			expect(birthDateInput.value).toEqual(date)
		})
	})

	it('birth date input shows errors', async () => {
		const today = moment().format('YYYY-MM-DD')

		fireEvent.change(birthDateInput, { target: { value: today } })
		fireEvent.change(birthDateInput, { target: { value: '' } })
		await waitFor(() => {
			expect(birthDateInput).toHaveAttribute('errors', 'Введіть дату народження.')
			expect(screen.getByText(/Введіть дату народження/)).toBeInTheDocument()
		})

		fireEvent.change(birthDateInput, { target: { value: today } })
		await waitFor(() => {
			expect(birthDateInput).toHaveAttribute('errors', 'Занадто молодий.')
			expect(screen.getByText(/Занадто молодий/)).toBeInTheDocument()
		})

		fireEvent.change(birthDateInput, { target: { value: '1949-01-01' } })
		await waitFor(() => {
			expect(birthDateInput).toHaveAttribute('errors', 'Занадто старий.')
			expect(screen.getByText(/Занадто старий/)).toBeInTheDocument()
		})
	})

	it('school class select value can be changed', () => {
		const [ classOption ] = classNumbers
		expect(mainSchoolClassInput).toHaveAttribute('options', classNumbers.join())
		userEvent.selectOptions(mainSchoolClassInput, classOption)
		expect(mainSchoolClassInput.value).toBe(classOption)
	})

	it('school class select shows error on empty input', async () => {
		userEvent.selectOptions(genderInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Виберіть поточний клас/)).toBeInTheDocument()
		})
	})

	it('benefits select value can be changed', () => {
		const [ firstOption ] = benefits
		expect(benefitsInput).toHaveAttribute('options', benefits.join())
		userEvent.selectOptions(benefitsInput, firstOption.toString())
		expect(benefitsInput.value).toBe(firstOption.toString())
		// no error checking, as the default option is set initially
	})

	it('main school title input value can be changed', () => {
		userEvent.type(mainSchoolInput, 'Elementary School')
		expect(mainSchoolInput.value).toBe('Elementary School')
	})

	it('main school title input shows errors on invalid input', async () => {
		userEvent.type(mainSchoolInput, 'Sc')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 3 символів/)).toBeInTheDocument()
		})

		userEvent.type(mainSchoolInput, twoHundredAndFiftySixCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 255 символів/)).toBeInTheDocument()
		})

		userEvent.clear(mainSchoolInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть основну адресу школи/)).toBeInTheDocument()
		})
	})

	it('home address input value can be changed', () => {
		userEvent.type(homeAddressInput, '13, Elm str.')
		expect(homeAddressInput.value).toBe('13, Elm str.')
	})

	it('home address input shows errors on invalid input', async () => {
		userEvent.type(homeAddressInput, 'A') // two chars min?
		await waitFor(() => {
			expect(screen.getByText(/Не менш 2 символів/)).toBeInTheDocument()
		})

		userEvent.type(homeAddressInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/)).toBeInTheDocument()
		})

		userEvent.clear(homeAddressInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть домашню адресу/)).toBeInTheDocument()
		})
	})

})
