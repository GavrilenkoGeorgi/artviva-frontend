import * as Yup from 'yup'
import { phoneNumber } from './constants/stringPatterns'

const genders = ['Чоловіча', 'Жіноча']
const classNumbers = ['Дошкільник', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', 'Студент']

export default function pupilFormValidationSchema(mode, users, specialtiesNames) {
	return Yup.object().shape({
		assignedTo: Yup.string()
		// eslint-disable-next-line
			.oneOf(users, 'Шукайте за прізвищем користувача та вибирайте електронну адресу користувача, призначеного поточному учню.'),
		name: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть прізвище та повне ім\'я учня.'),
		applicantName: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повнe ім\'я.'),
		specialty: Yup.string()
			.oneOf(specialtiesNames, 'Виберіть фах учня.')
			.required('Виберіть фах.'),
		artSchoolClass: Yup.number()
			.min(1, 'Перший або восьмий.')
			.max(8, 'Перший або восьмий.')
			.typeError('У якому класи навчается?'),
		dateOfBirth: Yup.date()
			.min(new Date(1950, 0, 1), 'Занадто старий.')
			.max(new Date(2019, 0, 1), 'Занадто молодий.')
			.required('Введіть дату народження.'),
		mainSchool: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(255, 'Максимум 255 символів.')
			.required('Введіть основну адресу школи.'),
		mainSchoolClass: Yup.string()
			.oneOf(classNumbers, 'Виберіть поточний клас.')
			.required('Виберіть поточний клас.'),
		gender: Yup.string()
			.oneOf(genders, 'Виберіть стать.')
			.required('Виберіть стать своєї дитини.'),
		hasBenefit: Yup.number()
			.min(0)
			.max(100),
		fathersName: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повнe ім\'я.'),
		fathersPhone: Yup.string()
			.min(3, 'Не менш 19 символів.')
			.max(19, 'Максимум 19 символів.')
			.matches(phoneNumber, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX')
			.required('Введіть номер телефону.'),
		fathersEmploymentInfo: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Місто, вулиця, назва організації, посада.'),
		mothersName: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть повнe ім\'я.'),
		mothersPhone: Yup.string()
			.min(3, 'Не менш 19 символів.')
			.max(19, 'Максимум 19 символів.')
			.matches(phoneNumber, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX')
			.required('Введіть номер телефону.'),
		mothersEmploymentInfo: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Місто, вулиця, назва організації, посада.'),
		contactEmail: Yup.string().trim()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть електронну пошту.'),
		homeAddress: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть домашню адресу.'),
		phoneNumber: Yup.string()
			.min(3, 'Не менш 19 символів.')
			.max(19, 'Максимум 19 символів.')
			.matches(phoneNumber, 'Перевірте форматування, має бути: +XX (XXX) XXX-XX-XX'),
		// this doesn't spark joy ((
		// next three fields are not present
		// in the teacher view form
		// but are needed in schema
		docsCheck: Yup.bool().test(value => {
			if (mode === 'create') {
				const schema = Yup.bool().oneOf([true, false])
				return schema.isValidSync(value)
			} else {
				const schema = Yup.bool().oneOf([true])
				return schema.isValidSync(value)
			}
		}),
		processDataCheck: Yup.bool().test(value => {
			if (mode === 'create') {
				const schema = Yup.bool().oneOf([true, false])
				return schema.isValidSync(value)
			} else {
				const schema = Yup.bool().oneOf([true])
				return schema.isValidSync(value)
			}
		}),
		paymentObligationsCheck: Yup.bool().test(value => {
			if (mode === 'create') {
				const schema = Yup.bool().oneOf([true, false])
				return schema.isValidSync(value)
			} else {
				const schema = Yup.bool().oneOf([true])
				return schema.isValidSync(value)
			}
		}),
		docsPresent: Yup.bool()
			.oneOf([true, false]),
		currentlyEnrolled: Yup.bool()
			.oneOf([true, false]),
		graduated: Yup.bool()
			.oneOf([true, false]),
		suspended: Yup.bool()
			.oneOf([true, false]),
		info: Yup.string()
			.min(3, 'Не менш 3 символів.')
			.max(255, 'Максимум 255 символів.')
	})
}
