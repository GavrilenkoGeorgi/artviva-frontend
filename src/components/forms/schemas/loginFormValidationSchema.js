import * as Yup from 'yup'
import { mediumStrPass } from './constants/stringPatterns'

export default function loginFormValidationSchema() {
	return Yup.object().shape({
		email: Yup.string().trim()
			.email('Адреса електронної пошти недійсна.')
			.required('Введіть свою електронну пошту.'),
		password: Yup.string()
			.min(8, 'Мінімум 8 символів.')
			.matches(mediumStrPass,
				'Мінімум 8 символів, принаймні одна велика літера, одна маленька літера та одне число.')
			.required('Будь ласка, введіть свій пароль.')
	})
}
