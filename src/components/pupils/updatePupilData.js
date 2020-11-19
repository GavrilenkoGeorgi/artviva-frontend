import searchService from '../../services/search'
import { history } from '../../Routes'

export const updatePupilData = async (
	{ values, userId },
	{ updatePupil, setNotification, setProcessingForm,
		setErrors, closeModal }) => {
	setProcessingForm(true)
	// remove teachers and schoolClasses as they are not updated
	// through this type of form
	// eslint-disable-next-line
	const { teachers, schoolClasses, ...valuesToSend } = values

	// if 'assignedTo' value is empty
	// set it to the current user ID
	// else get user ID from DB
	let { assignedTo } = values
	if (assignedTo.length) {
		const { id } = await searchService.getIdByEmail({ email: assignedTo })
		assignedTo = id
	} else {
		assignedTo = userId
	}

	updatePupil(values.id, { ...valuesToSend, assignedTo })
		.then(() => {
			setNotification({
				message: 'Зміни успішно збережено.',
				variant: 'success'
			}, 5)
			if (history.location.pathname === `/school/pupils/${values.id}`) {
				history.go(0)
			}
			if (closeModal) closeModal(true)
		})
		.catch(error => {
			const { message, cause } = { ...error.response.data }
			if (cause === 'name') {
				setErrors({ name: message })
			}
			setNotification({
				message,
				variant: 'danger'
			}, 5)
		})
		.finally(() => setProcessingForm(false))
}
