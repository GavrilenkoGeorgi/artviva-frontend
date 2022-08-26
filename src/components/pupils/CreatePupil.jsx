import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import searchService from '../../services/search'

import { PupilForm } from '../forms'
import { InfoModal } from '../common/modals'
import { setNotification, setProcessingForm } from '../../reducers/notificationReducer'
import { createPupil } from '../../reducers/pupilsReducer'
import formTexts from '../../data/formTexts.json'


const CreatePupil = ({
	user,
	specialties,
	createPupil,
	setNotification,
	setProcessingForm,
	closeModal }) => {

	const unmounted = useRef(false)
	const [infoModalVis, setInfoModalVis] = useState(false)
	const { benefitsExplained } = formTexts

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	const createNewPupil = async (values, setErrors, resetForm) => {
		setProcessingForm(true)
		// filter unnecessary values
		// eslint-disable-next-line
		const { docsCheck, processDataCheck, paymentObligationsCheck } = values

		// this shoulbe a separate thing as it is also used in edit mode
		// if 'assignedTo' value is empty
		// set it to the current user ID
		// else get user ID from DB
		let { assignedTo } = values
		if (assignedTo.length) {
			const { id } = await searchService.getIdByEmail({ email: assignedTo })
			assignedTo = id
		} else {
			assignedTo = user.id
		}

		createPupil({ ...values, assignedTo })
			.then(() => {
				setNotification({
					message: 'Новий учень був успішно додан.',
					variant: 'success'
				}, 5)
				resetForm()
				closeModal()
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
			.finally(() => {
				if (!unmounted.current)
					setProcessingForm(false)
			})
	}

	return <>
		<PupilForm
			handleFormData={createNewPupil}
			openInfoModal={() => setInfoModalVis(true)}
			specialties={specialties.map(spec => spec.title)}
			mode="create"
		/>
		<InfoModal
			title="Пільги на навчання"
			text={benefitsExplained}
			centered
			show={infoModalVis}
			onHide={() => setInfoModalVis(false)}
		/>
	</>
}

const mapStateToProps = (state) => {
	return {
		user: state.user,
		specialties: state.specialties,
		fetchingData: state.notification.fetchingData,
		processingForm: state.notification.processingForm
	}
}

const mapDispatchToProps = {
	createPupil,
	setNotification,
	setProcessingForm
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreatePupil)
