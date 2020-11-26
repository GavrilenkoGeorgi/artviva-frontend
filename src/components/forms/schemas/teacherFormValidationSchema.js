import * as Yup from 'yup'
import { phoneNumber } from './constants/stringPatterns'
import { select } from '../../../data/forms/teacherFields.json'
import { fieldChoices } from '../../../utils/formsUtils'

const choices = fieldChoices(select)

export default function teacherFormValidationSchema(specialtyListData) {
	return Yup.object().shape({
		name: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть прізвище, ім’я і по батькові (ПІБ).'),
		specialties: Yup.array().of(
			Yup.string()
				.oneOf(specialtyListData, 'Ви повинні вибрати не менше одного фаху.')
				.required('Це поле є обов\'язковим.')
		),
		dateOfBirth: Yup.date()
			.min(new Date(1940, 0, 1), 'Занадто старий.')
			.max(new Date(2019, 0, 1), 'Занадто молодий.')
			.required('Введіть дату народження.'),
		employmentDate: Yup.date()
			.min(new Date(1940, 0, 1), 'Занадто далеко.')
			.max(new Date(2040, 0, 1), 'Ви впевнені?')
			.required('Перевірте дату.'),
		years: Yup.number()
			.typeError('Повинно бути числом.')
			.min(0, 'Нуль або більше.')
			.max(99, 'Ви впевнені?'),
		months: Yup.number()
			.typeError('Повинно бути числом.')
			.min(0, 'Нуль або більше.')
			.max(11, 'Забагато.'),
		days: Yup.number()
			.typeError('Повинно бути числом.')
			.min(0, 'Нуль або більше.')
			.max(31, 'Забагато.'),
		weekWorkHours: Yup.number()
			.typeError('Повинно бути числом.')
			.min(0, 'Нуль або більше.')
			.max(100, 'Забагато.'),
		phone: Yup.string()
			.min(3, 'Не менш 19 символів.')
			.max(19, 'Максимум 19 символів.')
			.matches(phoneNumber, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX')
			.required('Введіть номер телефону.'),
		contactEmail: Yup.string().trim()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть електронну пошту.'),
		residence: Yup.string()
			.oneOf(choices.residence, 'Місто або село.')
			.required('Місцевість прожівання.'),
		gender: Yup.string()
			.oneOf(choices.gender, 'Перевірте значення.')
			.required('Виберіть стать.'),
		maritalStatus: Yup.string()
			.oneOf(choices.maritalStatus, 'Перевірте значення.')
			.required('Вкажить сімейне положення.'),
		university: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть назву навчального закладу.'),
		educationType: Yup.string()
			.oneOf(choices.educationType, 'Перевірте значення.')
			.required('Вкажить освітній рівень.'),
		educationDegree: Yup.string()
			.oneOf(choices.educationDegree, 'Перевірте значення.')
			.required('Вкажить освітньо-кваліфікаційний рівень.'),
		qualification: Yup.string()
			.oneOf(choices.qualification, 'Перевірте значення.')
			.required('Вкажить кваліфікаційну категорію.'),
		teacherTitle: Yup.string()
			.oneOf(choices.teacherTitle, 'Перевірте значення.')
			.required('Вкажить педагогічне звання.'),
		scienceDegree: Yup.string()
			.oneOf(choices.scienceDegree, 'Перевірте значення.')
			.required('Вкажить наукову ступінь.'),
		category: Yup.number()
			.oneOf(choices.category, 'Перевірте значення.')
			.required('Вкажить розряд.'),
		employeeType: Yup.string()
			.oneOf(choices.employeeType, 'Перевірте значення.')
			.required('Вкажить тип співробітника.'),
		isAdministration: Yup.bool()
			.oneOf([true, false]),
		isRetired: Yup.bool()
			.oneOf([true, false]),
		employeeIsAStudent: Yup.bool()
			.oneOf([true, false]),
		accomplishmentsDscr: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(2500, 'Максимум 2500 символів.'),
		info: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(255, 'Максимум 255 символів.')
	})
}
