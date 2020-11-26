import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment-precise-range-plugin'

import teacherFormSchema from './schemas/teacherFormValidationSchema'
import { trimObject } from '../../utils/objectHelpers'
import { formatPhoneNumber } from '../../utils/formatPhoneNumber'
import { fullTimeEmployee, parseIntegerValue, currentExperience,
	calcEmployeeExperience, fieldChoices } from '../../utils/formsUtils'
import { teacherAccomplishmentsDscr } from '../../data/formTexts.json'
import { select } from '../../data/forms/teacherFields.json'

import { Row, Col, Form, Button } from 'react-bootstrap'
import { Formik, FieldArray, ErrorMessage } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'

import BtnWithSpinner from '../common/buttons/BtnWithSpinner'
import ResetBtn from './buttons/Reset'
import NumberInput from './components/NumberInput'
import TextInput from './components/TextInput'
import DateInput from './components/DateInput'
import Select from './components/Select'
import CheckBox from './components/Checkbox'
import TextAreaInput from './components/TextAreaInput'
import { InfoModal } from '../common/modals'
import FocusError from './components/FocusError'

const TeacherForm = ({
	user,
	teacher,
	specialties,
	mode,
	processingForm,
	processTeacherData,
}) => {

	const [editMode, setEditMode] = useState(false)
	const [specialtyListData, setSpecialtyListData] = useState([])
	const [unusedSpecialties, setUnusedSpecialties] = useState(null)
	const [partTimeEmployee, setPartTimeEmployee] = useState(true)
	const [employeeExperience, setEmployeeExperience] = useState({ years: 0, months: 0, days: 0 })
	const [infoModalVis, setInfoModalVis] = useState(false)
	const today = moment()
	const choices = fieldChoices(select)

	useEffect(() => {
		setSpecialtyListData(specialties.map(specialty => specialty.title))
		if (mode === 'edit') {
			setEditMode(true)
			const fullList = new Set(specialties.map(specialty => specialty.title))
			const used = new Set(teacher.specialties.map(specialty => specialty.title))
			const difference = new Set([...fullList].filter((item) => !used.has(item)))
			setUnusedSpecialties(Array.from(difference))

			// set experience
			const today = moment() //?
			const experience = currentExperience(teacher.experienceToDate, teacher.employmentDate, today)
			setEmployeeExperience(experience)

			// disable check box if needed
			fullTimeEmployee(teacher.employeeType)
				? setPartTimeEmployee(false)
				: setPartTimeEmployee(true)
		}
	}, [teacher, specialties, editMode, mode])

	const changeEmployeeType = ({ target }, setFieldValue) => {
		const { value: employeeType, name: fieldName } = target
		fullTimeEmployee(employeeType)
			? setPartTimeEmployee(false)
			: setPartTimeEmployee(true); setFieldValue('isAdministration', false)
		setFieldValue(fieldName, employeeType)
	}

	// eslint-disable-next-line
	const handleTeacher = (values, setErrors, resetForm) => {
		// get selected specialties id's
		const uniqueSpecialties = new Set(values.specialties)
		let specialtiesIds = []
		uniqueSpecialties.forEach(title => {
			const index = specialties.findIndex(specialty => specialty.title === title)
			specialtiesIds.push(specialties[index].id)
		})

		// extract classes and payments data so we don't send them in this form
		// eslint-disable-next-line
		let { years, months, days, payments, schoolClasses, ...valuesToSend } = values

		// update some fields with prepared data
		valuesToSend = { ...valuesToSend,
			specialties: specialtiesIds,
			experienceToDate: editMode
				? { years: parseIntegerValue(years),
					months: parseIntegerValue(months),
					days: parseIntegerValue(days) }
				: employeeExperience
		}
		processTeacherData(trimObject(valuesToSend), setErrors, resetForm)
	}

	const calcExp = (event, values) => {
		const { name, value } = event.target
		const { years, months, days, employmentDate } = values

		const field = {
			name,
			value
		}
		const data = {
			employmentDate,
			years,
			months,
			days
		}

		const result = calcEmployeeExperience(field, data)

		setEmployeeExperience({
			...employeeExperience,
			years: result.years,
			months: result.months,
			days: result.days
		})
	}

	// form data and schema
	const defaultValues = {
		name: '',
		specialties: [''],
		dateOfBirth: '',
		employmentDate: today.format('YYYY-MM-DD'),
		years: '',
		months: '',
		days: '',
		weekWorkHours: '',
		phone: '',
		contactEmail: '',
		residence: '',
		gender: '',
		maritalStatus: '',
		university: '',
		educationType: '',
		educationDegree: '',
		qualification: '',
		teacherTitle: '',
		scienceDegree: '',
		category: '',
		employeeType: '',
		isAdministration: false,
		isRetired: false,
		employeeIsAStudent: false,
		accomplishmentsDscr: '',
		info: ''
	}

	const initialFormValues = () => {
		return editMode
			? { ...teacher,
				dateOfBirth: moment(teacher.dateOfBirth).format('YYYY-MM-DD'),
				employmentDate: moment(teacher.employmentDate).format('YYYY-MM-DD'),
				specialties: teacher.specialties
					.map(specialty => specialty.title),
				years: teacher.experienceToDate.years,
				months: teacher.experienceToDate.months,
				days: teacher.experienceToDate.days,
			}
			: defaultValues
	}

	return <>
		<Formik
			initialValues={initialFormValues()}
			enableReinitialize
			onSubmit={(values, { resetForm, setErrors }) => {
				handleTeacher(values, setErrors, resetForm)
			}}
			onReset={() => {
				editMode
				// eslint-disable-next-line
					? setEmployeeExperience(currentExperience(teacher.experienceToDate, teacher.employmentDate, today))
					: setEmployeeExperience({ years: 0, months: 0, days: 0 })
			}}
			validationSchema={teacherFormSchema(specialtyListData)}
		>
			{({ handleSubmit,
				handleChange,
				handleBlur,
				setFieldValue,
				handleReset,
				values,
				touched,
				errors,
			}) => (
				<Form
					id="teacher-form"
					data-cy="teacher-form"
					noValidate
					onSubmit={handleSubmit}
					className="text-left"
				>
					{/* Teacher name input */}
					<Form.Row>
						<TextInput
							label="ПІБ (прізвище, ім’я і по батькові)"
							name="name"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.name}
							touched={touched.name}
							errors={errors.name}
							className="col"
						/>
					</Form.Row>

					<FieldArray
						name="specialties"
						render={arrayHelpers => (
							<>
								<Col xs={12} className="text-center py-3">
									<span className="text-muted">
										Виберіть спеціальність викладача
									</span>
								</Col>
								{values.specialties.map((specialty, index) => (
									<Form.Row
										key={index}
									>
										<Col xs={12}>
											<Form.Control
												as="select"
												className="mb-2"
												aria-label="Виберіть спеціальність викладача"
												label="Виберіть спеціальність викладача"
												name={`specialties[${index}]`}
												data-cy={`specialties-${index}`}
												value={values.specialties[index]}
												onChange={handleChange}
												isValid={touched.specialties && !errors.specialties}
											>
												{editMode
													? <>
														<option>Виберіть...</option>
														{teacher.specialties.map((specialty) =>
															<option
																className="text-primary"
																value={specialty.title}
																key={specialty.title}
															>
																{specialty.title}
															</option>
														)}
														{unusedSpecialties.map(specialty =>
															<option
																value={specialty}
																key={specialty}
															>
																{specialty}
															</option>
														)}
													</>
													: <>
														<option>Виберіть...</option>
														{specialtyListData.map(specialty =>
															<option
																value={specialty}
																key={specialty}
															>
																{specialty}
															</option>
														)}
													</>
												}
											</Form.Control>
										</Col>

										<Col xs={8}>
											<ErrorMessage
												name={`specialties[${index}]`}
												className="border border-primary"
												render={msg => (
													<span className="form-validation-error-mk2">
														{msg}
													</span>
												)}
											/>
										</Col>

										<Col xs={4} className="my-2 align-items-end">
											<Row className="d-flex justify-content-center">
												{values.specialties.length > 1
													? <Col className="pr-1">
														{/* remove specialty from the list */}
														<Button
															block
															variant="outline-danger" size="sm"
															onClick={() => arrayHelpers.remove(index)}
														>
															<FontAwesomeIcon icon={faMinus} />
														</Button>
													</Col>
													: null
												}
												<Col className="pl-1">
													{/* add an empty input */}
													<Button
														block
														variant="outline-success" size="sm"
														onClick={() => arrayHelpers.push(index)}
													>
														<FontAwesomeIcon icon={faPlus} />
													</Button>
												</Col>
											</Row>
										</Col>
									</Form.Row>
								))}
							</>
						)}
					/>

					{/* Teacher experience */}
					<Form.Row>
						<Col xs={12} className="text-center pt-3">
							<span className="text-muted">
								Дата прийняття на роботу
							</span>
						</Col>
						<DateInput
							aria-label="Дата прийняття на роботу"
							label="Дата прийняття на роботу"
							name="employmentDate"
							onChange={handleChange}
							onBlur={handleBlur}
							onInput={event => calcExp(event, values)}
							value={values.employmentDate}
							touched={touched.employmentDate}
							errors={errors.employmentDate}
						/>

						<Col xs={12} className="text-center pt-3">
							<span className="text-muted">
								Додатковий стаж
							</span>
						</Col>
						<TextInput
							label="Років"
							name="years"
							onChange={handleChange}
							onBlur={handleBlur}
							onKeyUp={event => calcExp(event, values)}
							value={values.years}
							touched={touched.years}
							errors={errors.years}
							className="px-1"
						/>

						<TextInput
							label="місяців"
							name="months"
							onChange={handleChange}
							onBlur={handleBlur}
							onKeyUp={event => calcExp(event, values)}
							value={values.months}
							touched={touched.months}
							errors={errors.months}
							className="px-1"
						/>

						<TextInput
							label="днів"
							name="days"
							onChange={handleChange}
							onBlur={handleBlur}
							onKeyUp={event => calcExp(event, values)}
							value={values.days}
							touched={touched.days}
							errors={errors.days}
							className="px-1"
						/>

						<Col xs={12} className="py-3">
							<div>
								Робочий стаж:
								<strong> {employeeExperience.years}
								</strong> років
								<strong> {employeeExperience.months}
								</strong> міс.
								<strong> {employeeExperience.days}
								</strong> днів
							</div>
						</Col>
					</Form.Row>

					<Form.Row>
						<NumberInput
							label="Тижневе навантаження. Часів:"
							name="weekWorkHours"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.weekWorkHours}
							touched={touched.weekWorkHours}
							errors={errors.weekWorkHours}
							className="px-1"
						/>
					</Form.Row>

					<Form.Row>
						<TextInput
							label="Телефонний номер"
							name="phone"
							onChange={handleChange}
							onKeyUp={event => formatPhoneNumber(event, 'phone', setFieldValue)}
							onBlur={handleBlur}
							value={values.phone}
							touched={touched.phone}
							errors={errors.phone}
							className="px-1"
						/>
					</Form.Row>

					<Form.Row>
						<TextInput
							label="Контактна електронна пошта"
							name="contactEmail"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.contactEmail}
							touched={touched.contactEmail}
							errors={errors.contactEmail}
							className="px-1"
						/>
					</Form.Row>

					<Form.Row>
						<Select
							label="Місцевість проживання"
							name="residence"
							options={choices.residence}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.residence}
							touched={touched.residence}
							errors={errors.residence}
						/>
						<Select
							label="Стать"
							name="gender"
							options={choices.gender}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.gender}
							touched={touched.gender}
							errors={errors.gender}
						/>
					</Form.Row>

					<Form.Row>
						<Select
							label="Сімеїний стан"
							name="maritalStatus"
							options={choices.maritalStatus}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.maritalStatus}
							touched={touched.maritalStatus}
							errors={errors.maritalStatus}
						/>

						<DateInput
							label="Дата народження"
							name="dateOfBirth"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.dateOfBirth}
							touched={touched.dateOfBirth}
							errors={errors.dateOfBirth}
						/>
					</Form.Row>

					<Form.Row>
						<TextInput
							label="Навчальний заклад"
							name="university"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.university}
							touched={touched.university}
							errors={errors.university}
							className="px-1"
						/>
					</Form.Row>

					<Form.Row>
						<Select
							label="Освітній рівень"
							name="educationType"
							options={choices.educationType}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.educationType}
							touched={touched.educationType}
							errors={errors.educationType}
						/>

						<Select
							label="Освітньо-кваліфікаційний рівень"
							name="educationDegree"
							options={choices.educationDegree}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.educationDegree}
							touched={touched.educationDegree}
							errors={errors.educationDegree}
						/>
					</Form.Row>

					<Form.Row>
						<Select
							label="Кваліфікаційна категорія"
							name="qualification"
							options={choices.qualification}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.qualification}
							touched={touched.qualification}
							errors={errors.qualification}
						/>

						<Select
							label="Педагогічне звання"
							name="teacherTitle"
							options={choices.teacherTitle}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.teacherTitle}
							touched={touched.teacherTitle}
							errors={errors.teacherTitle}
						/>
					</Form.Row>

					<Form.Row>
						<Select
							label="Наукова ступінь"
							name="scienceDegree"
							options={choices.scienceDegree}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.scienceDegree}
							touched={touched.scienceDegree}
							errors={errors.scienceDegree}
						/>
						<Select
							label="Розряд"
							name="category"
							options={choices.category}
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.category}
							touched={touched.category}
							errors={errors.category}
						/>
					</Form.Row>

					<Form.Row>
						<Select
							label="Тип співробітника"
							name="employeeType"
							options={choices.employeeType}
							onChange={handleChange}
							onBlur={handleBlur}
							onInput={event => changeEmployeeType(event, setFieldValue)}
							value={values.employeeType}
							touched={touched.employeeType}
							errors={errors.employeeType}
						/>

						{user.superUser &&
							<Col xs={6} className="py-1">
								<CheckBox
									type="checkbox"
									id={editMode
										? `${teacher.id}-admin-employee-checkbox`
										: 'admin-employee-checkbox'
									}
									label="Адміністрація"
									name="isAdministration"
									dataCy="admin-employee-checkbox"
									onChange={handleChange}
									onBlur={handleBlur}
									disabled={partTimeEmployee}
									checked={values.isAdministration}
									value={values.isAdministration}
									touched={touched.isAdministration}
									errors={errors.isAdministration}
								/>
							</Col>
						}

						<Col xs={6} className="py-1">
							<CheckBox
								type="checkbox"
								id={editMode
									? `${teacher.id}-retired-employee-checkbox`
									: 'retired-employee-checkbox'
								}
								label="Пенсионер"
								name="isRetired"
								dataCy="retired-employee-checkbox"
								onChange={handleChange}
								onBlur={handleBlur}
								checked={values.isRetired}
								value={values.isRetired}
								touched={touched.isRetired}
								errors={errors.isRetired}
							/>
						</Col>

						<Col xs={6} className="py-1">
							<CheckBox
								type="checkbox"
								id={editMode
									? `${teacher.id}-employee-is-student-checkbox`
									: 'employee-is-student-checkbox'
								}
								label="Студент"
								name="employeeIsAStudent"
								dataCy="employee-is-student-checkbox"
								onChange={handleChange}
								onBlur={handleBlur}
								checked={values.employeeIsAStudent}
								value={values.employeeIsAStudent}
								touched={touched.employeeIsAStudent}
								errors={errors.employeeIsAStudent}
							/>
						</Col>
						<Col xs={12}>
							<TextAreaInput
								label="Здобуття у цьому навчальному році"
								rows={5}
								name="accomplishmentsDscr"
								infoBtn
								showInfo={() => setInfoModalVis(!infoModalVis)}
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.accomplishmentsDscr}
								touched={touched.accomplishmentsDscr}
								errors={errors.accomplishmentsDscr}
							/>
						</Col>
						<Col xs={12}>
							<TextAreaInput
								label="Додаткова інформація/опис"
								rows={2}
								name="info"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.info}
								touched={touched.info}
								errors={errors.info}
							/>
						</Col>
					</Form.Row>

					{/* Button */}
					<Form.Group
						as={Col}
						className="pt-4 px-0 d-flex justify-content-end"
					>
						<BtnWithSpinner
							loadingState={processingForm}
							className="px-4 default-width-btn"
							variant={editMode ? 'success' : 'primary'}
							type="submit"
							label={editMode ? 'Зберегти' : 'Додати'}
							dataCy="add-teacher-btn"
						/>
						<ResetBtn
							label="Очистити"
							variant="light"
							dataCy="teacher-form-reset"
							onClick={handleReset}
							className="ml-2 default-width-btn"
						/>
					</Form.Group>
					<FocusError formId="teacher-form" />
				</Form>
			)}
		</Formik>
		<InfoModal
			title={'Здобуття у цьому навчальному році'}
			text={teacherAccomplishmentsDscr}
			btnLabel="OK"
			centered
			show={infoModalVis}
			onHide={() => setInfoModalVis(!infoModalVis)}
		/>
	</>
}

TeacherForm.propTypes = {
	user: PropTypes.object.isRequired,
	teacher: PropTypes.object,
	specialties: PropTypes.array.isRequired,
	mode: PropTypes.oneOf(['create', 'edit']).isRequired,
	processingForm: PropTypes.bool,
	processTeacherData: PropTypes.func.isRequired,
}

export default TeacherForm
