import React from 'react'
import { Provider } from 'react-redux'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import store from '../../../store'
import moment from 'moment'
import PupilForm from '../../../components/forms/PupilForm'
import specialties from '../../../fixtures/specialties.json'
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

	it('pupil\'s name input value can be changed', () => {
		userEvent.type(nameInput, 'Joe Doe')
		expect(nameInput.value).toBe('Joe Doe')
	})

	it('pupil\'s name input shows errors on invalid input', async () => {
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

	it('pupil\'s phone number input value can be changed', () => {
		userEvent.type(phoneNumberInput, '0505555555')
		expect(phoneNumberInput.value).toBe('0505555555')
	})

	it('pupil\'s phone number input shows errors on invalid input', async () => {
		userEvent.type(phoneNumberInput, '123aaaa')
		await waitFor(() => {
			expect(screen.getByText('Перевірте форматування, 10 символів: "0505554433"'))
				.toBeInTheDocument()
		})
	})

	it('applicant\'s name input value can be changed', () => {
		userEvent.type(applicantNameInput, 'Joe Doe')
		expect(applicantNameInput.value).toBe('Joe Doe')
	})

	it('applicant\'s name input shows errors on invalid input', async () => {
		userEvent.type(applicantNameInput, 'A')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 2 символів/)).toBeInTheDocument()
			userEvent.clear(applicantNameInput)
		})

		userEvent.clear(applicantNameInput)
		userEvent.type(applicantNameInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/)).toBeInTheDocument()
		})

		userEvent.clear(applicantNameInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть повнe ім'я особи, яка звертається із заявою/)).toBeInTheDocument()
		})
	})

	it('contact email input value can be changed', () => {
		userEvent.type(contactEmailInput, 'test@example.com')
		expect(contactEmailInput.value).toBe('test@example.com')
	})

	it('contact email input shows errors on invalid input', async () => {
		userEvent.type(contactEmailInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Адреса електронної пошти недійсна/))
				.toBeInTheDocument()
		})

		userEvent.type(contactEmailInput, 'test@example.')
		await waitFor(() => {
			expect(screen.getByText(/Адреса електронної пошти недійсна/))
				.toBeInTheDocument()
		})

		userEvent.clear(contactEmailInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть електронну пошту/))
				.toBeInTheDocument()
		})
	})

	// parents info inputs

	it('father\'s name input value can be changed', () => {
		userEvent.type(fathersNameInput, 'Joe Doe')
		expect(fathersNameInput.value).toBe('Joe Doe')
	})

	it('father\'s name input shows errors on invalid input', async () => {
		userEvent.type(fathersNameInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 2 символів/))
				.toBeInTheDocument()
		})

		userEvent.type(fathersNameInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/))
				.toBeInTheDocument()
		})

		userEvent.clear(fathersNameInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть повнe ім'я батька/))
				.toBeInTheDocument()
		})
	})

	it('father\'s phone number input value can be changed', () => {
		userEvent.type(fathersPhoneInput, '0505555555')
		expect(fathersPhoneInput.value).toBe('0505555555')
	})

	it('father\'s phone number input shows errors on invalid input', async () => {
		userEvent.type(fathersPhoneInput, '1234aaaa')
		await waitFor(() => {
			expect(screen.getByText('Перевірте форматування, 10 символів: "0505554433"'))
				.toBeInTheDocument()
		})
	})

	it('father\'s employment info input value can be changed', () => {
		userEvent.type(fathersEmploymentInfoInput, 'Strickland Propane')
		expect(fathersEmploymentInfoInput.value).toBe('Strickland Propane')
	})

	it('father\'s employment info input shows errors on invalid input', async () => {
		userEvent.type(fathersEmploymentInfoInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 2 символів/))
				.toBeInTheDocument()
		})

		userEvent.type(fathersEmploymentInfoInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/))
				.toBeInTheDocument()
		})

		userEvent.clear(fathersEmploymentInfoInput)
		await waitFor(() => {
			expect(screen.getByText(/Місто, вулиця, назва організації, посада батька/))
				.toBeInTheDocument()
		})
	})

	it('mother\'s name input value can be changed', () => {
		userEvent.type(mothersNameInput, 'Mary Doe')
		expect(mothersNameInput.value).toBe('Mary Doe')
	})

	it('mother\'s name input shows errors on invalid input', async () => {
		userEvent.type(mothersNameInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 2 символів/))
				.toBeInTheDocument()
		})

		userEvent.type(mothersNameInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/))
				.toBeInTheDocument()
		})

		userEvent.clear(mothersNameInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть повнe ім'я матері/))
				.toBeInTheDocument()
		})
	})

	it('mother\'s phone number input value can be changed', () => {
		userEvent.type(mothersPhoneInput, '0505555555')
		expect(mothersPhoneInput.value).toBe('0505555555')
	})

	it('mother\'s phone number input shows errors on invalid input', async () => {
		userEvent.type(mothersPhoneInput, '123sdfsdf')
		await waitFor(() => {
			expect(screen.getByText('Перевірте форматування, 10 символів: "0505554433"'))
				.toBeInTheDocument()
		})
	})

	it('mother\'s employment info input value can be changed', () => {
		userEvent.type(mothersEmploymentInfoInput, 'Arlen Elementary')
		expect(mothersEmploymentInfoInput.value).toBe('Arlen Elementary')
	})

	it('mother\'s employment info input shows errors on invalid input', async () => {
		userEvent.type(mothersEmploymentInfoInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 2 символів/))
				.toBeInTheDocument()
		})

		userEvent.type(mothersEmploymentInfoInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/))
				.toBeInTheDocument()
		})

		userEvent.clear(mothersEmploymentInfoInput)
		await waitFor(() => {
			expect(screen.getByText(/Місто, вулиця, назва організації, посада матері/))
				.toBeInTheDocument()
		})
	})

	// checkboxes

	it('docs check can be checked', () => {
		expect(docsCheck.value).toBe('false')
		userEvent.click(docsCheck)
		expect(docsCheck.value).toBe('true')
	})

	it('process personal data check can be checked', () => {
		expect(processDataCheck.value).toBe('false')
		userEvent.click(processDataCheck)
		expect(processDataCheck.value).toBe('true')
	})

	it('payment obligations check can be checked', () => {
		expect(paymentObligationsCheck.value).toBe('false')
		userEvent.click(paymentObligationsCheck)
		expect(paymentObligationsCheck.value).toBe('true')
	})

	// buttons

	it('submit button doesn\'t submit empty form', () => {
		userEvent.click(submitButton)
		expect(mockHandleFormData).not.toHaveBeenCalled()
	})

	it('reset button clears form', () => {
		userEvent.type(nameInput, 'Joe Doe')
		userEvent.click(resetButton)
		expect(nameInput.value).toBe('')
	})

	// info modals

	it('process personal data info modal can be opened', () => {
		userEvent.click(screen.getByText('збір та обробку'))
		expect(mockOpenInfoModal).toBeCalled()
	})

	it('payment obligations info modal can be opened', () => {
		userEvent.click(screen.getByText('Зобов\'язання'))
		expect(mockOpenInfoModal).toBeCalled()
	})

	// properly filled form can be submitted

	it('"send" button submits form data', async () => {
		const [ specialty ] = specOptions
		const [ gender ] = genders
		const date = moment().subtract(5, 'years').format('YYYY-MM-DD')
		const [ classNumber ] = classNumbers
		const [ benefitValue ] = benefits

		// pupil data
		userEvent.type(nameInput, 'Joe Doe')
		userEvent.selectOptions(specialtyInput, specialty)
		userEvent.selectOptions(genderInput, gender)
		fireEvent.change(birthDateInput, { target: { value: date } })
		userEvent.selectOptions(mainSchoolClassInput, classNumber)
		userEvent.selectOptions(benefitsInput, benefitValue.toString())
		userEvent.type(mainSchoolInput, 'Elementary School')
		userEvent.type(homeAddressInput, '13, Elm str.')
		userEvent.type(phoneNumberInput, '0505555555')
		userEvent.type(applicantNameInput, 'Joe Doe')
		userEvent.type(contactEmailInput, 'test@example.com')

		// parents data
		userEvent.type(fathersNameInput, 'Joe Doe')
		userEvent.type(fathersPhoneInput, '0505555555')
		userEvent.type(fathersEmploymentInfoInput, 'Strickland Propane')

		userEvent.type(mothersNameInput, 'Mary Doe')
		userEvent.type(mothersPhoneInput, '0505555555')
		userEvent.type(mothersEmploymentInfoInput, 'Arlen Elementary')

		// checkboxes
		userEvent.click(docsCheck)
		userEvent.click(processDataCheck)
		userEvent.click(paymentObligationsCheck)

		userEvent.click(submitButton)
		await waitFor(() => {
			expect(mockHandleFormData).toHaveBeenCalled()
		})
	})

})
