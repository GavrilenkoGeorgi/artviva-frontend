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
	// eslint-disable-next-line
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
	let isAdministrationCheckbox
	let isRetiredCheckbox
	let employeeIsAStudentCheckbox
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
		isAdministrationCheckbox = screen.getByRole('checkbox', { name: /Адміністрація/ })
		isRetiredCheckbox = screen.getByRole('checkbox', { name: /Пенсионер/ })
		employeeIsAStudentCheckbox = screen.getByRole('checkbox', { name: /Студент/ })
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

	it('gender input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.gender

		expect(genderInput).toHaveAttribute('options', selectFieldsData.gender.join())
		userEvent.selectOptions(genderInput, firstOption)
		expect(genderInput.value).toBe(firstOption)
	})

	it('gender select shows error on empty input', async () => {
		userEvent.selectOptions(genderInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('marital status input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.maritalStatus

		expect(maritalStatusInput).toHaveAttribute('options', selectFieldsData.maritalStatus.join())
		userEvent.selectOptions(maritalStatusInput, firstOption)
		expect(maritalStatusInput.value).toBe(firstOption)
	})

	it('marital status input shows error on empty input', async () => {
		userEvent.selectOptions(maritalStatusInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('birth date input value can be changed', async () => {
		const date = moment().subtract(18, 'years').format('YYYY-MM-DD')
		fireEvent.change(dateOfBirthInput, { target: { value: date } })
		await waitFor(() => {
			expect(dateOfBirthInput.value).toEqual(date)
		})
	})

	it('birth date input shows errors', async () => {
		const today = moment().format('YYYY-MM-DD')

		fireEvent.change(dateOfBirthInput, { target: { value: today } })
		fireEvent.change(dateOfBirthInput, { target: { value: '' } })
		await waitFor(() => {
			expect(dateOfBirthInput).toHaveAttribute('errors', 'Введіть дату народження.')
			expect(screen.getByText(/Введіть дату народження/)).toBeInTheDocument()
		})

		fireEvent.change(dateOfBirthInput, { target: { value: '1939-01-01' } })
		await waitFor(() => {
			expect(dateOfBirthInput).toHaveAttribute('errors', 'Занадто старий.')
			expect(screen.getByText(/Занадто старий/)).toBeInTheDocument()
		})

		fireEvent.change(dateOfBirthInput, { target: { value: today } })
		await waitFor(() => {
			expect(dateOfBirthInput).toHaveAttribute('errors', 'Занадто молодий.')
			expect(screen.getByText(/Занадто молодий/)).toBeInTheDocument()
		})
	})

	it('university input value can be changed', () => {
		userEvent.type(universityInput, 'Some Posh Uni')
		expect(universityInput.value).toBe('Some Posh Uni')
	})

	it('university input shows errors on invalid input', async () => {
		userEvent.type(universityInput, 'abcd')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 5 символів/))
				.toBeInTheDocument()
		})

		userEvent.clear(universityInput)
		userEvent.type(universityInput, oneHundredAndTwentyNineCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 128 символів/))
				.toBeInTheDocument()
		})

		userEvent.clear(universityInput)
		await waitFor(() => {
			expect(screen.getByText(/Введіть назву навчального закладу/))
				.toBeInTheDocument()
		})
	})

	it('education type input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.educationType

		expect(educationTypeInput).toHaveAttribute('options', selectFieldsData.educationType.join())
		userEvent.selectOptions(educationTypeInput, firstOption)
		expect(educationTypeInput.value).toBe(firstOption)
	})

	it('education type input shows error on empty input', async () => {
		userEvent.selectOptions(educationTypeInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('education degree input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.educationDegree

		expect(educationDegreeInput).toHaveAttribute('options', selectFieldsData.educationDegree.join())
		userEvent.selectOptions(educationDegreeInput, firstOption)
		expect(educationDegreeInput.value).toBe(firstOption)
	})

	it('education degree input shows error on empty input', async () => {
		userEvent.selectOptions(educationDegreeInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('qualification input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.qualification

		expect(qualificationInput).toHaveAttribute('options', selectFieldsData.qualification.join())
		userEvent.selectOptions(qualificationInput, firstOption)
		expect(qualificationInput.value).toBe(firstOption)
	})

	it('qualification input shows error on empty input', async () => {
		userEvent.selectOptions(qualificationInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('teacher title input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.teacherTitle

		expect(teacherTitleInput).toHaveAttribute('options', selectFieldsData.teacherTitle.join())
		userEvent.selectOptions(teacherTitleInput, firstOption)
		expect(teacherTitleInput.value).toBe(firstOption)
	})

	it('teacher title input shows error on empty input', async () => {
		userEvent.selectOptions(teacherTitleInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('science degree input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.scienceDegree

		expect(scienceDegreeInput).toHaveAttribute('options', selectFieldsData.scienceDegree.join())
		userEvent.selectOptions(scienceDegreeInput, firstOption)
		expect(scienceDegreeInput.value).toBe(firstOption)
	})

	it('science degree input shows error on empty input', async () => {
		userEvent.selectOptions(scienceDegreeInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('category input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.category

		expect(categoryInput).toHaveAttribute('options', selectFieldsData.category.join())
		userEvent.selectOptions(categoryInput, firstOption)
		expect(categoryInput.value).toBe(firstOption)
	})

	it('category input shows error on empty input', async () => {
		userEvent.selectOptions(categoryInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('employee type input value can be changed', () => {
		const [ firstOption ] = selectFieldsData.employeeType

		expect(employeeTypeInput).toHaveAttribute('options', selectFieldsData.employeeType.join())
		userEvent.selectOptions(employeeTypeInput, firstOption)
		expect(employeeTypeInput.value).toBe(firstOption)
	})

	it('employee type input shows error on empty input', async () => {
		userEvent.selectOptions(employeeTypeInput, 'Виберіть...')
		await waitFor(() => {
			expect(screen.getByText(/Перевірте значення/)).toBeInTheDocument()
		})
	})

	it('accomplishments description input value can be changed', () => {
		userEvent.type(accomplishmentsDscrInput, 'Some really good accoplishment this year.')
		expect(accomplishmentsDscrInput.value).toBe('Some really good accoplishment this year.')
	})

	it('accomplishments description input shows error on invalid input', async () => {
		userEvent.type(accomplishmentsDscrInput, 'abcd')
		await waitFor(() => {
			// screen.debug(accomplishmentsDscrInput)
			expect(screen.getByText(/Не менш 5 символів/)).toBeInTheDocument()
		})
	})

	it('additional info input value can be changed', () => {
		userEvent.type(infoInput, 'More test info.')
		expect(infoInput.value).toBe('More test info.')
	})

	it('additional info input shows error on invalid input', async () => {
		userEvent.type(infoInput, 'ab')
		await waitFor(() => {
			expect(screen.getByText(/Не менш 3 символів/)).toBeInTheDocument()
		})

		userEvent.clear(infoInput)
		userEvent.type(infoInput, twoHundredAndFiftySixCharacters)
		await waitFor(() => {
			expect(screen.getByText(/Максимум 255 символів/)).toBeInTheDocument()
		})
	})

	// checkboxes

	it('teacher is administration check can\'t be checked if employee is not a full-time worker', () => {
		expect(isAdministrationCheckbox.value).toBe('false')
		userEvent.click(isAdministrationCheckbox)
		expect(isAdministrationCheckbox.value).toBe('false')
	})

	it('teacher is administration check can be checked if employee is a full-time worker', () => {
		expect(isAdministrationCheckbox.value).toBe('false')
		userEvent.selectOptions(employeeTypeInput, 'Штатний співробітник')
		userEvent.click(isAdministrationCheckbox)
		expect(isAdministrationCheckbox.value).toBe('true')
	})

	it('teacher is retired check can be checked', () => {
		expect(isRetiredCheckbox.value).toBe('false')
		userEvent.click(isRetiredCheckbox)
		expect(isRetiredCheckbox.value).toBe('true')
	})

	it('teacher is a student check can be checked', () => {
		expect(employeeIsAStudentCheckbox.value).toBe('false')
		userEvent.click(employeeIsAStudentCheckbox)
		expect(employeeIsAStudentCheckbox.value).toBe('true')
	})

	// buttons

	it('submit button doesn\'t submit empty form', () => {
		userEvent.click(submitButton)
		expect(mockProcessTeacherData).not.toHaveBeenCalled()
	})

	it('reset button clears form', () => {
		userEvent.type(nameInput, 'Joe Doe')
		userEvent.click(resetButton)
		expect(nameInput.value).toBe('')
	})

	it('submits properly filled form', async () => {
		const validFormData = {
			name: 'Joe Doe',
			specialty: specOptions[0],
			employmentDate: moment().format('YYYY-MM-DD'),
			experienceToDate: {
				years: '1',
				months: '1',
				days: '1'
			},
			weekWorkHours: '36',
			phone: '1234567890',
			contactEmail: 'test@example.com',
			residence: selectFieldsData.residence[0],
			gender: selectFieldsData.gender[0],
			maritalStatus: selectFieldsData.maritalStatus[0],
			dateOfBirth: moment().subtract(18, 'years').format('YYYY-MM-DD'),
			university: 'Some Posh Uni',
			educationType: selectFieldsData.educationType[0],
			educationDegree: selectFieldsData.educationDegree[0],
			qualification: selectFieldsData.qualification[0],
			teacherTitle: selectFieldsData.teacherTitle[0],
			scienceDegree: selectFieldsData.scienceDegree[0],
			category: selectFieldsData.category[0],
			employeeType: selectFieldsData.employeeType[0],
			accomplishmentsDscr: 'Some new accoplishment.',
			info: 'Some additional info',
		}

		userEvent.type(nameInput, validFormData.name)
		userEvent.selectOptions(specialtiesInput, validFormData.specialty)
		fireEvent.change(employmentDateInput, { target: { value: validFormData.employmentDate } })

		userEvent.type(yearsInput, validFormData.experienceToDate.years)
		userEvent.type(monthsInput, validFormData.experienceToDate.months)
		userEvent.type(daysInput, validFormData.experienceToDate.days)
		userEvent.type(weekWorkHoursInput, validFormData.weekWorkHours)
		userEvent.type(phoneNumberInput, validFormData.phone)
		userEvent.type(contactEmailInput, validFormData.contactEmail)
		userEvent.selectOptions(residenceInput, validFormData.residence)
		userEvent.selectOptions(genderInput, validFormData.gender)
		userEvent.selectOptions(maritalStatusInput, validFormData.maritalStatus)
		fireEvent.change(dateOfBirthInput, { target: { value: validFormData.dateOfBirth } })
		userEvent.type(universityInput, validFormData.university)
		userEvent.selectOptions(educationTypeInput, validFormData.educationType)
		userEvent.selectOptions(educationDegreeInput, validFormData.educationDegree)
		userEvent.selectOptions(qualificationInput, validFormData.qualification)
		userEvent.selectOptions(teacherTitleInput, validFormData.teacherTitle)
		userEvent.selectOptions(scienceDegreeInput, validFormData.scienceDegree)
		userEvent.selectOptions(categoryInput, validFormData.category)
		userEvent.selectOptions(employeeTypeInput, validFormData.employeeType)
		userEvent.type(accomplishmentsDscrInput, validFormData.accomplishmentsDscr)
		userEvent.type(infoInput, validFormData.info)

		userEvent.click(isAdministrationCheckbox)
		userEvent.click(isRetiredCheckbox)
		userEvent.click(employeeIsAStudentCheckbox)

		userEvent.click(submitButton)

		// remove 'specialty' prop, as it is converted to 'specialties' after from validation
		// eslint-disable-next-line
		let { specialty, ...fieldValues } = validFormData

		// some other values are stored as integers
		const processedValuesToSend = {
			...fieldValues,
			specialties: [ specialties[0].id ],
			experienceToDate: {
				years: 1,
				months: 1,
				days: 1
			},
			weekWorkHours: 36,
			phone: '+38 (123) 456-78-90',
			isAdministration: true,
			isRetired: true,
			employeeIsAStudent: true
		}

		await waitFor(() => {
			expect(mockProcessTeacherData).toHaveBeenCalledTimes(1)
			expect(mockProcessTeacherData).toHaveBeenCalledWith(
				processedValuesToSend, expect.any(Function), expect.any(Function))
		})
	})

})
