import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setNotification } from '../../reducers/notificationReducer'
import { createSchoolClass, updateSchoolClass } from '../../reducers/schoolClassesReducer'
import searchService from '../../services/search'
import schoolClassesService from '../../services/schoolClasses'
import { debounce } from '../../utils/debounce'
import { trimObject } from '../../utils/objectHelpers'

import { Formik, FieldArray, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import BtnWithSpinner from '../common/BtnWithSpinner'

const SchoolClassForm = ({
	schoolClass,
	user,
	setNotification,
	createSchoolClass,
	updateSchoolClass,
	closeModal,
	mode }) => {

	const [editMode, setEditMode] = useState(false)
	const [pupilError, setPupilError] = useState(false)
	const [processingForm, setProcessingForm] = useState(false)

	useEffect(() => {
		if (mode === 'edit') {
			setEditMode(true)
		}
	// eslint-disable-next-line
	}, [])

	useEffect(() => {
		searchService.setToken(user.token)
		schoolClassesService.setToken(user.token)
	}, [user])

	// lists for form input autocomplete suggestions
	const [teachersList, setTeachersList] = useState([])
	const [pupilsList, setPupilsList] = useState([])
	const [specialtiesList, setSpecialtiesList] = useState([])

	// search something in db as user types
	const search = data => {
		// pupils data.value is unique id in the
		// values array, as it is a multiline input
		// hence this rename
		const pupilsPattern = /pupils(\[)(\d{0,2})(])/i
		if (pupilsPattern.exec(data.name)) {
			data = { ...data, name: 'pupil' }
		}

		// then
		if (data.value <= 2 ) {
			return console.warn('Потрібно більше даних для пошуку.')
		}

		const queryPattern = /^[A-ZА-ЯҐЄІЇ]{2,64}$/i
		if (queryPattern.exec(data.value)) {
			const query = {
				value: data.value
			}
			switch (data.name) {
			case 'teacher':
				return searchTeachers(query)
			case 'pupil':
				return searchPupils(query)
			case 'specialty':
				return searchSpecialties(query)
			default:
				return false
			}
		} else console.warn('Перевірте формат data.value.')
	}

	const searchTeachers = query => {
		searchService.teachers(query)
			.then((data) => {
				setTeachersList(data)
			})
			.catch(error => {
				console.error(error)
			})
	}

	const searchPupils = query => {
		searchService.pupils(query)
			.then((data) => {
				setPupilsList(data)
			})
			.catch(error => {
				console.error(error)
			})
	}

	const searchSpecialties = query => {
		searchService.specialties(query)
			.then((data) => {
				setSpecialtiesList(data)
			})
			.catch(error => {
				console.error(error)
			})
	}

	const checkSubmitBtnState = ({ pupils }) => {
		pupils[0] === ''
			? setPupilError(true)
			: setPupilError(false)
	}

	const handleSchoolClass = (values, setErrors, resetForm) => {
		setProcessingForm(true)
		// check if at least one pupil was added
		// need this cause of variable number of pupils fields
		if (values.pupils.length === 0) {
			setPupilError(true)
			return
		}
		// if current form mode is edit or create..
		editMode
			? existingSchoolClass(trimObject(values))
			: newSchoolClass(trimObject(values), setErrors, resetForm)
	}

	const newSchoolClass = (values, setErrors, resetForm) => {
		createSchoolClass(values)
			.then(() => {
				setNotification({
					message: 'Новий клас був успішно додан.',
					variant: 'success'
				}, 5)
				resetForm()
			})
			.catch(error => {
				const { message, cause } = { ...error.response.data }
				if (cause === 'name') { // this!
					setErrors({ name: message })
				}
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingForm(false))
	}

	const existingSchoolClass = (values) => {
		updateSchoolClass(schoolClass.id, values)
			.then(() => {
				setNotification({
					message: 'Зміни успішно збережено.',
					variant: 'success'
				}, 5)
				if (closeModal) closeModal()
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
			.finally(() => setProcessingForm(false))
	}

	// form data and schema
	const initialFormValues = () =>
		editMode
			? { ...schoolClass,
				teacher: schoolClass.teacher.name,
				specialty: schoolClass.specialty.title,
				pupils: schoolClass.pupils.map(pupil => pupil.name)
			}
			: { title: '', info: '', teacher: '', specialty: '', pupils: [''] }

	const schoolClassFormSchema = Yup.object().shape({
		title: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть назву класу.'),
		info: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(255, 'Максимум 255 символів.'),
		// .required('Введіть опис.'),
		teacher: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть ім\'я викладача.'),
		specialty: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть назву спеціальності.'),
		pupils: Yup.array().of(
			Yup.string()
				.min(2, 'Не менш 2 символів.')
				.max(128, 'Максимум 128 символів.')
				.required('Це поле є обов\'язковим.')
		)
	})

	return (
		<Container>
			<Formik
				initialValues={initialFormValues()}
				enableReinitialize
				onSubmit={async (values, { resetForm, setErrors }) => {
					await handleSchoolClass(values, setErrors, resetForm)
				}}
				validationSchema={schoolClassFormSchema}
			>
				{({ handleSubmit,
					handleChange,
					handleBlur,
					values,
					touched,
					errors,
				}) => (
					<Form
						data-cy="school-class-form"
						noValidate
						onSubmit={handleSubmit}
						className="text-left"
					>
						{/* School class title */}
						<Form.Row className="d-flex justify-content-center">
							<Form.Group
								controlId={
									editMode
										? `school-class-title-input-${schoolClass.id}`
										: 'school-class-title-input'}
								as={Col}
								className="mb-4"
							>
								<Form.Label>
									Назва класу
									<span className="form-required-mark"> *</span>
								</Form.Label>
								<Form.Control
									type="text"
									name="title"
									data-cy="title-input"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.title}
									isValid={touched.title && !errors.title}
									isInvalid={touched.title && !!errors.title}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.title}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>

						{/* School class info */}
						<Form.Row className="d-flex justify-content-center">
							<Form.Group
								controlId={
									editMode
										? `school-class-info-input-${schoolClass.id}`
										: 'school-class-info-input'}
								as={Col}
								className="mb-4"
							>
								<Form.Label>
									Опис/інформація про клас
								</Form.Label>
								<Form.Control
									as="textarea"
									rows="3"
									name="info"
									data-cy="info-input"
									onChange={handleChange}
									onBlur={handleBlur}
									value={values.info}
									isValid={touched.info && !errors.info}
									isInvalid={touched.info && !!errors.info}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.info}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>

						{/* School class teacher */}
						<Form.Row className="d-flex justify-content-center">
							<Form.Group
								controlId={
									editMode
										? `school-class-teacher-input-${schoolClass.id}`
										: 'school-class-teacher-input'}
								as={Col}
								className="mb-4"
							>
								<Form.Label>
									Викладач
									<span className="form-required-mark"> *</span>
								</Form.Label>
								<Form.Control
									type="text"
									name="teacher"
									data-cy="teacher-name-input"
									list={editMode ? `teachers-list-${schoolClass.id}` : 'teachers-list'}
									autoComplete="off"
									onChange={handleChange}
									onKeyUp={event => debounce(search(event.target), 1000)}
									onBlur={handleBlur}
									value={values.teacher}
									isValid={touched.teacher && !errors.teacher}
									isInvalid={touched.teacher && !!errors.teacher}
								/>
								<datalist id={editMode ? `teachers-list-${schoolClass.id}` : 'teachers-list'}>
									{teachersList.map((name) =>
										<option key={name} value={name} />
									)}
								</datalist>
								<Form.Control.Feedback type="invalid">
									{errors.teacher}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>

						{/* School class specialty */}
						<Form.Row className="d-flex justify-content-center">
							<Form.Group
								controlId={
									editMode
										? `school-class-specialty-input-${schoolClass.id}`
										: 'school-class-specialty-input'}
								as={Col}
								className="mb-4"
							>
								<Form.Label>
									Фах класу
									<span className="form-required-mark"> *</span>
								</Form.Label>
								<Form.Control
									type="text"
									name="specialty"
									data-cy="specialty-input"
									list={editMode
										? `specialties-list-${schoolClass.id}`
										: 'specialties-list'}
									autoComplete="off"
									onChange={handleChange}
									onKeyUp={event => debounce(search(event.target), 1000)}
									onBlur={handleBlur}
									value={values.specialty}
									isValid={touched.specialty && !errors.specialty}
									isInvalid={touched.specialty && !!errors.specialty}
								/>
								<datalist id={editMode
									? `specialties-list-${schoolClass.id}`
									: 'specialties-list'}>
									{specialtiesList.map((title) =>
										<option key={title} value={title} />
									)}
								</datalist>
								<Form.Control.Feedback type="invalid">
									{errors.specialty}
								</Form.Control.Feedback>
							</Form.Group>
						</Form.Row>

						{/* School pupils list */}
						<FieldArray
							name="pupils"
							render={arrayHelpers => (
								<>
									<Form.Label>
										Перелік учнів
										<span className="form-required-mark"> *</span>
									</Form.Label>
									{values.pupils && values.pupils.length > 0 ? (
										values.pupils.map((pupil, index) => (
											<Form.Row key={index} className="d-flex justify-content-end">
												<Col xs={12}>
													<Form.Control
														type="text"
														name={`pupils[${index}]`}
														list={editMode
															? `pupils-list-${schoolClass.id}`
															: 'pupils-list'}
														autoComplete="off"
														value={values.pupils[index]}
														onChange={handleChange}
														onBlur={handleBlur}
														onKeyUp={event => debounce(search(event.target), 1000)}
														isValid={touched.pupils && !errors.pupils}
														// isInvalid={touched.specialties && !!errors.specialties}
													/>
													<datalist id={editMode
														? `pupils-list-${schoolClass.id}`
														: 'pupils-list'}>
														{pupilsList.map(name => (
															<option key={name} value={name} >{name}</option>
														)
														)}
													</datalist>
												</Col>

												<Col xs={8}>
													<ErrorMessage
														name={`pupils[${index}]`}
														className="border border-primary"
														render={msg => (
															<span className="form-validation-error-mk2">
																{msg}
															</span>
														)}
													/>
												</Col>

												<Col xs={4} className="my-2 align-items-end border1 border-secondary">
													<Row className="d-flex justify-content-center">
														<Col className="pr-1">
															{/* remove pupil from the list */}
															<Button
																block
																variant="outline-danger" size="sm"
																onClick={() => {
																	arrayHelpers.remove(index)
																	checkSubmitBtnState(arrayHelpers.form.values)
																}}
															>
																<FontAwesomeIcon icon={faMinus} />
															</Button>
														</Col>
														<Col className="pl-1">
															{/* add an empty pupil input */}
															<Button
																block
																variant="outline-success" size="sm"
																onClick={() => { arrayHelpers.push('')
																	checkSubmitBtnState(arrayHelpers.form.values)
																}}
															>
																<FontAwesomeIcon icon={faPlus} />
															</Button>
														</Col>
													</Row>
												</Col>
											</Form.Row>
										))
									) : (
										<Button
											className="my-2"
											variant={pupilError ? 'outline-danger' : 'outline-primary'}
											varialt="outline-primary"
											onClick={() => {
												arrayHelpers.push('')
												checkSubmitBtnState(arrayHelpers.form.values)
											}}>
											{/* show this btn when if user has removed all specialties from the list */}
											Додати учня
										</Button>
									)}
								</>
							)}
						/>

						{/* Button */}
						<Form.Row className="d-flex justify-content-center text-center">
							<Form.Group
								as={Col}
								className="pt-4"
							>
								<BtnWithSpinner
									className="px-4"
									variant={editMode ? 'success' : 'primary'}
									type="submit"
									label={editMode ? 'Зберегти' : 'Додати новій клас'}
									dataCy="add-class-btn"
									loadingState={processingForm}
								/>
							</Form.Group>
						</Form.Row>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

SchoolClassForm.propTypes = {
	schoolClass: PropTypes.object,
	user: PropTypes.object.isRequired,
	setNotification: PropTypes.func.isRequired,
	createSchoolClass: PropTypes.func.isRequired,
	updateSchoolClass: PropTypes.func.isRequired,
	mode: PropTypes.oneOf(['create', 'edit']).isRequired,
	closeModal: PropTypes.func
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification,
	createSchoolClass,
	updateSchoolClass
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SchoolClassForm)
