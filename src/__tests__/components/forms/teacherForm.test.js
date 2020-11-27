import React from 'react'
import { Provider } from 'react-redux'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import store from '../../../store'
import moment from 'moment'
import { oneHundredAndTwentyNineCharacters,
	twoHundredAndFiftySixCharacters } from '../../../__mocks__/strings'
import TeacherForm from '../../../components/forms/TeacherForm'
import specialties from '../../../__mocks__/specialties.json'
import adminUser from '../../../__mocks__/adminUser.json'
import { select as selectChoices } from '../../../data/forms/teacherFields.json'
import { prepareSelectData } from '../../../utils/formsUtils'

const mockProcessTeacherData = jest.fn()
const selectFieldsData = prepareSelectData(selectChoices)

describe('<TeacherForm /> component', () => {
	const specOptions = specialties.map(spec => spec.title)

	let view

	let nameInput
	let specialtiesInput
	let employmentDateInput
	let yearsInput
	let monthsInput
	let daysInput
	let weekWorkHoursInput
	let phoneNumberInput
	let contactEmailInput
	let residenceInput
	let genderInput
	let maritalStatusInput
	let dateOfBirthInput
	let universityInput
	let educationTypeInput
	let educationDegreeInput
	let qualificationInput
	let teacherTitleInput
	let scienceDegreeInput
	let categoryInput
	let employeeTypeInput
	// checkboxes
	let isAdministrationInput
	let isRetiredInput
	let employeeIsAStudentInput
	// text area
	let accomplishmentsDscrInput
	let infoInput
	// buttons
	let submitButton
	let resetButton

	beforeEach(() => {
		view = render(
			<Provider store={store}>
				<TeacherForm
					user={adminUser}
					mode="create"
					processingForm={false}
					processTeacherData={mockProcessTeacherData}
					specialties={specialties}
				/>
			</Provider>
		)

		nameInput = screen.getByRole('textbox', { name: /ПІБ \(прізвище, ім’я і по батькові\) \*/ })
		specialtiesInput = screen.getByRole('combobox', { name: /Виберіть спеціальність викладача/ })
		employmentDateInput = screen.getByLabelText(/Дата прийняття на роботу/)
		yearsInput = screen.getByRole('textbox', { name: /Років \*/ })
		monthsInput = screen.getByRole('textbox', { name: /місяців \*/ })
		daysInput = screen.getByRole('textbox', { name: /днів \*/ })
		weekWorkHoursInput = screen.getByRole('spinbutton', { name: /Тижневе навантаження. Часів: \*/ })
		phoneNumberInput = screen.getByRole('textbox', { name: /Телефонний номер \*/ })
		contactEmailInput = screen.getByRole('textbox', { name: /Контактна електронна пошта \*/ })
		residenceInput = screen.getByRole('combobox', { name: /Місцевість проживання \*/ })
		genderInput = screen.getByRole('combobox', { name: /Стать \*/ })
		maritalStatusInput = screen.getByRole('combobox', { name: /Сімеїний стан \*/ })
		dateOfBirthInput = screen.getByLabelText(/Дата народження/)
		universityInput = screen.getByRole('textbox', { name: /Навчальний заклад \*/ })
		educationTypeInput = screen.getByRole('combobox', { name: /Освітній рівень \*/ })
		educationDegreeInput = screen.getByRole('combobox', { name: /Освітньо-кваліфікаційний рівень \*/ })
		qualificationInput = screen.getByRole('combobox', { name: /Кваліфікаційна категорія \*/ })
		teacherTitleInput = screen.getByRole('combobox', { name: /Педагогічне звання \*/ })
		scienceDegreeInput = screen.getByRole('combobox', { name: /Наукова ступінь \*/ })
		categoryInput = screen.getByRole('combobox', { name: /Розряд \*/ })
		employeeTypeInput = screen.getByRole('combobox', { name: /Тип співробітника \*/ })
		// checkboxes
		isAdministrationInput = screen.getByRole('checkbox', { name: /Адміністрація/ })
		isRetiredInput = screen.getByRole('checkbox', { name: /Пенсионер/ })
		employeeIsAStudentInput = screen.getByRole('checkbox', { name: /Студент/ })
		// textareas
		accomplishmentsDscrInput = screen.getByRole('textbox', { name: /Здобуття у цьому навчальному році/ })
		infoInput = screen.getByRole('textbox', { name: /Додаткова інформація\/опис/ })
		// buttons
		submitButton = screen.getByRole('button', { name: /Додати/ })
		resetButton = screen.getByRole('button', { name: /Очистити/ })
	})

	it('teachers\'s name input value can be changed', () => {
		userEvent.type(nameInput, 'Joe Doe')
		expect(nameInput.value).toBe('Joe Doe')
	})

	it('teacher\'s name input shows errors on invalid input', async () => {
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
			expect(screen.getByText(/Введіть прізвище, ім’я і по батькові \(ПІБ\)/)).toBeInTheDocument()
		})
	})

	it('specialty input value can be changed', () => {
		const [ firstOption ] = specOptions

		expect(specialtiesInput).toHaveAttribute('options', specOptions.join())
		userEvent.selectOptions(specialtiesInput, firstOption)
		expect(specialtiesInput.value).toBe(firstOption)
	})

	it('employment date input value can be changed', async () => {
		const date = moment().format('YYYY-MM-DD')
		fireEvent.change(employmentDateInput, { target: { value: date } })
		await waitFor(() => {
			expect(employmentDateInput.value).toEqual(date)
		})
	})

	it('employment date input shows errors', async () => {
		const today = moment().format('YYYY-MM-DD')

		fireEvent.change(employmentDateInput, { target: { value: today } })
		fireEvent.change(employmentDateInput, { target: { value: '' } })
		await waitFor(() => {
			expect(employmentDateInput).toHaveAttribute('errors', 'Перевірте дату.')
			expect(screen.getByText(/Перевірте дату/)).toBeInTheDocument()
		})

		fireEvent.change(employmentDateInput, { target: { value: '1939-01-01' } })
		await waitFor(() => {
			expect(employmentDateInput).toHaveAttribute('errors', 'Занадто далеко.')
			expect(screen.getByText(/Занадто далеко/)).toBeInTheDocument()
		})

		fireEvent.change(employmentDateInput, { target: { value: '2041-01-01' } })
		await waitFor(() => {
			expect(employmentDateInput).toHaveAttribute('errors', 'Ви впевнені?')
			expect(screen.getByText(/Ви впевнені\?/)).toBeInTheDocument()
		})
	})

	it('experience input values can be changed', () => {
		userEvent.type(yearsInput, '1')
		expect(yearsInput.value).toBe('1')

		userEvent.type(monthsInput, '1')
		expect(monthsInput.value).toBe('1')

		userEvent.type(daysInput, '1')
		expect(daysInput.value).toBe('1')
	})

	it('years experience input shows errors on invalid input', async () => {
		userEvent.type(yearsInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Повинно бути числом/)).toBeInTheDocument()
		})

		userEvent.clear(yearsInput)
		userEvent.type(yearsInput, '-1')
		await waitFor(() => {
			expect(screen.getByText(/Нуль або більше/)).toBeInTheDocument()
		})

		userEvent.clear(yearsInput)
		userEvent.type(yearsInput, '100')
		await waitFor(() => {
			expect(screen.getByText(/Ви впевнені\?/)).toBeInTheDocument()
		})
	})

	it('months experience input shows errors on invalid input', async () => {
		userEvent.type(monthsInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Повинно бути числом/)).toBeInTheDocument()
		})

		userEvent.clear(monthsInput)
		userEvent.type(monthsInput, '-1')
		await waitFor(() => {
			expect(screen.getByText(/Нуль або більше/)).toBeInTheDocument()
		})

		userEvent.clear(monthsInput)
		userEvent.type(monthsInput, '12')
		await waitFor(() => {
			expect(screen.getByText(/Забагато/)).toBeInTheDocument()
		})
	})

	it('days experience input shows errors on invalid input', async () => {
		userEvent.type(daysInput, 'a')
		await waitFor(() => {
			expect(screen.getByText(/Повинно бути числом/)).toBeInTheDocument()
		})

		userEvent.clear(daysInput)
		userEvent.type(daysInput, '-1')
		await waitFor(() => {
			expect(screen.getByText(/Нуль або більше/)).toBeInTheDocument()
		})

		userEvent.clear(daysInput)
		userEvent.type(daysInput, '32')
		await waitFor(() => {
			expect(screen.getByText(/Забагато/)).toBeInTheDocument()
		})
	})

	it('week work hours input value can be changed', () => {
		userEvent.type(weekWorkHoursInput, '1')
		expect(weekWorkHoursInput.value).toBe('1')
	})

	it('week work hours input shows errors on invalid input', async () => {
		userEvent.type(weekWorkHoursInput, '-1')
		await waitFor(() => {
			expect(screen.getByText(/Нуль або більше/)).toBeInTheDocument()
		})

		userEvent.clear(weekWorkHoursInput)
		userEvent.type(weekWorkHoursInput, '101')
		await waitFor(() => {
			expect(screen.getByText(/Забагато/)).toBeInTheDocument()
		})
	})

	it('phone number input value can be changed', () => {
		userEvent.type(phoneNumberInput, '0505555555')
		expect(phoneNumberInput.value).toBe('+38 (050) 555-55-55')
	})

	it('phone number input shows errors on invalid input', async () => {
		userEvent.type(phoneNumberInput, 'qwertyuiopasdfghjkl')
		await waitFor(() => {
			expect(screen.getByText('Перевірте форматування, має бути: +38 (XXX) XXX-XX-XX'))
				.toBeInTheDocument()
		})

		userEvent.clear(phoneNumberInput)
		userEvent.type(phoneNumberInput, 'as')
		await waitFor(() => {
			expect(screen.getByText('Перевірте форматування, 19 символів: +38 (XXX) XXX-XX-XX'))
				.toBeInTheDocument()
		})

		userEvent.clear(phoneNumberInput)
		userEvent.type(phoneNumberInput, '12345678901')
		await waitFor(() => {
			expect(screen.getByText('Перевірте форматування, 19 символів: +38 (XXX) XXX-XX-XX'))
				.toBeInTheDocument()
		})
	})

	it('email input value can be changed', () => {
		userEvent.type(contactEmailInput, 'test@example.com')
		expect(contactEmailInput.value).toBe('test@example.com')
	})

	it('email input shows errors on invalid input', async () => {
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

	it('residence input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.residence

		expect(residenceInput).toHaveAttribute('options', selectFieldsData.residence.join())
		userEvent.selectOptions(residenceInput, firstOption)
		expect(residenceInput.value).toBe(firstOption)
	})

	it('residence input shows errors on invalid input', async () => {
		userEvent.selectOptions(residenceInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Місто або село/)).toBeInTheDocument()
		})
	})

	it('gender select shows error on empty input', async () => {
		userEvent.selectOptions(genderInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

})
