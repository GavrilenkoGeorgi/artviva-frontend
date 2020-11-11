import * as Yup from 'yup'

export default function contactFormValidationSchema() {
	return Yup.object().shape({
		name: Yup.string().trim()
			.min(2, 'Мінімум 2 символи.')
			.max(30, 'Максимум 30 символів.')
			.required('Ваше ім\'я?'),
		email: Yup.string().trim()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть свою електронну пошту.'),
		message: Yup.string().trim()
			.min(8, 'Мінімум 8 символів.')
			.max(280, 'Максимум 280 символів.')
			.required('Будь ласка, введіть своє повідомлення.')
	})
}
