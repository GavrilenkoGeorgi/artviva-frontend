import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import PupilForm from '../../../components/forms/PupilForm'
import store from '../../../store'
import specialties from '../../../__mocks__/specialties.json'

const mockHandleFormData = jest.fn()
const mockOpenInfoModal = jest.fn()

describe('Login form', () => {
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
				<Router>
					<PupilForm
						handleFormData={mockHandleFormData}
						openInfoModal={mockOpenInfoModal}
						specialties={specialties.map(spec => spec.title)}
						mode="public"
					/>
				</Router>
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

	it('renders public view correctly', () => {
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

})
