import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { history } from '../../../Routes'
import pupilsService from '../../../services/pupils'
import { setNotification, setProcessingForm } from '../../../reducers/notificationReducer'

import { Container, Col } from 'react-bootstrap'
import PupilForm from '../../forms/PupilForm'
import PublicApplyStatus from '../../pupils/PublicApplyStatus'
import CommonLayout from '../../CommonLayout'
import { InfoModal } from '../../common/modals'

import formTexts from '../../../data/formTexts.json'

const PublicApplyView = ({ match, specialties, setNotification, setProcessingForm }) => {

	const unmounted = useRef(false)
	const [infoModalVis, setInfoModalVis] = useState(false)
	const [infoModalText, setInfoModalText] = useState({})
	const [infoModalTitle, setInfoModalTitle] = useState('')

	const { paymentObligations,
		personalDataProcessing, benefitsExplained } = formTexts

	useEffect(() => {
		return () => { unmounted.current = true }
	}, [])

	/**
	 * Process public apply form data
	 *
	 * @param {object} values - New pupil data
	 * @param {function} setErrors - Function to set error on form field
	 */

	const handleFormData = (values, setErrors) => {
		setProcessingForm(true)
		// remove 'assignedTo', as it is a public form
		// eslint-disable-next-line
		const { assignedTo, ...valuesToSend } = values
		pupilsService.publicApply(valuesToSend)
			.then(() => {
				setNotification({
					message: 'Ваша заява була успішно додана.',
					variant: 'success'
				}, 15)
				history.push('/apply/success')
			})
			.catch(error => {
				// set local form errors
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

	const openInfoModal = type => {
		let title
		switch (type) {
		case 'personal-data':
			title = 'Я згоден на збір та обробку моїх персональних даних'
			setInfoModalText(personalDataProcessing)
			break
		case 'payment':
			title = 'Зобов\'язання про оплату'
			setInfoModalText(paymentObligations)
			break
		case 'benefits':
			title = 'Пільги на навчання'
			setInfoModalText(benefitsExplained)
			break
		default:
			break
		}
		setInfoModalTitle(title)
		setInfoModalVis(true)
	}

	return <CommonLayout>
		<Helmet>
			<title>Подати заяву до школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Заповнити форму та подати заяву на навчання до школи мистецтв." />
		</Helmet>
		<>
			{match.params.status
				? <PublicApplyStatus status={match.params.status}/>
				: <>
					<h4 className="mt-3 mb-4 text-center custom-font">Подати заяву на навчання</h4>
					<Container className="px-0 mb-5 d-flex justify-content-center">
						<Col lg={8}>
							<PupilForm
								handleFormData={handleFormData}
								openInfoModal={openInfoModal}
								specialties={specialties.map(spec => spec.title)}
								mode="public"
							/>
						</Col>
					</Container>
					<InfoModal
						title={infoModalTitle}
						text={infoModalText}
						centered
						show={infoModalVis}
						onHide={() => setInfoModalVis(!infoModalVis)}
					/>
				</>
			}
		</>
	</CommonLayout>
}

PublicApplyView.propTypes = {
	match: PropTypes.object.isRequired,
	setNotification: PropTypes.func.isRequired,
	setProcessingForm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
	return {
		specialties: state.specialties
	}
}

const mapDispatchToProps = {
	setNotification,
	setProcessingForm
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PublicApplyView)
