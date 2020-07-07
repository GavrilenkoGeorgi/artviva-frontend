import { nestedSort } from './arrayHelpers'

export const paymentSort = ({ checked, id }, setOrder, setData) => {
	const order = checked ? 'desc' : 'asc'
	switch (id) {
	case 'pupil':
		setDescPayPupilNameSortOrder(checked)
		setTeacherDetails({
			...teacherDetails,
			payments: teacherDetails.payments.sort(nestedSort('paymentDescr', id, order))
		})
		break
	case 'create_date':
		setDescPayDateSortOrder(checked)
		setTeacherDetails({
			...teacherDetails,
			payments: teacherDetails.payments.sort(nestedSort(id, null, order))
		})
		break
	default:
		console.warn('Check sort criteria.')
	}
}