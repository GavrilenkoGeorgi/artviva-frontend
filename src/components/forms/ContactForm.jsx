import React from 'react'
import PropTypes from 'prop-types'

import { Col, Container, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import contactFormSchema from './schemas/contactFormValidationSchema'

import { TextAreaInput, TextInput } from '../forms/components'
import { BtnWithSpinner } from '../common/buttons'

const ContactForm = ({
	handleContactMessage,
	processing,
	score }) => {

	return <Formik
		initialValues={{
			name: '',
			email: '',
			message: ''
		}}
		onSubmit={(values, { resetForm }) => {
			handleContactMessage({ values, resetForm })
		}}
		validationSchema={contactFormSchema}
	>
		{({ handleSubmit,
			handleChange,
			handleBlur,
			values,
			touched,
			errors
		}) => (
			<Form
				data-cy="contact-form"
				noValidate
				onSubmit={handleSubmit}
			>
				{/* Message sender name input */}
				<Container>
					<Form.Row>
						<TextInput
							label="Ваше ім&apos;я"
							name="name"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.name}
							touched={touched.name}
							errors={errors.name}
						/>
					</Form.Row>

					{/* Message sender email input */}
					<Form.Row>
						<TextInput
							label="Ваша електронна пошта"
							name="email"
							type="email"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.email}
							touched={touched.email}
							errors={errors.email}
						/>
					</Form.Row>

					{/* Message body input */}
					<Form.Row>
						<Col xs={12} className="px-0">
							<TextAreaInput
								label="Ваше повідомлення"
								rows={6}
								name="message"
								onChange={handleChange}
								onBlur={handleBlur}
								value={values.message}
								touched={touched.message}
								errors={errors.message}
							/>
						</Col>
					</Form.Row>

					{/* Button */}
					<Form.Row className="mt-3 d-flex justify-content-center">
						<BtnWithSpinner
							type="submit"
							loadingState={processing}
							disabled={score !== 0 && score <= .3 ? true : false}
							label="Відправити"
							variant="primary"
							dataCy="contact-msg-btn"
							className="primary-color-shadow max-width-btn"
						/>
					</Form.Row>
				</Container>
			</Form>
		)}
	</Formik>
}

ContactForm.propTypes = {
	handleContactMessage: PropTypes.func.isRequired,
	processing: PropTypes.bool.isRequired,
	score: PropTypes.number
}

export default ContactForm
