import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { Formik } from 'formik'
import loginFormSchema from './schemas/loginFormValidationSchema'

import { Col, Form } from 'react-bootstrap'
import { PasswordInput, TextInput } from '../forms/components'
import { BtnWithSpinner } from '../common/buttons'

const LoginForm = ({ handleLogin, processing, score }) => {

	return <Formik
		initialValues={{
			email: '',
			password: ''
		}}
		onSubmit={async (values) => {
			handleLogin(values)
		}}
		validationSchema={loginFormSchema}
	>
		{({ handleSubmit,
			handleChange,
			handleBlur,
			values,
			touched,
			errors
		}) => (
			<Form
				data-cy="login-form"
				noValidate
				onSubmit={handleSubmit}
			>

				{/* User email input */}
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

				{/* User password input */}
				<Form.Row>
					<PasswordInput
						label="Ваш пароль"
						name="password"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values.password}
						touched={touched.password}
						errors={errors.password}
					/>
				</Form.Row>

				{/* Links */}
				<Form.Row className="d-flex justify-content-center">
					<Form.Group
						as={Col}
						sm={12}
						className="d-flex pt-3
						justify-content-between
						align-items-center"
					>
						<Link to="/register">
							Реєстрація
						</Link>
						<Link to="/recover">
							Відновлення паролю
						</Link>
					</Form.Group>

					{/* Button */}
					<Form.Group
						as={Col}
						sm={12}
						className="d-flex pt-3
							justify-content-center
							align-items-center"
					>
						<BtnWithSpinner
							type="submit"
							loadingState={processing}
							disabled={score !== 0 && score < .3 ? true : false} //?
							label="Вхід"
							variant="primary"
							dataCy="login-btn"
							className="max-width-btn primary-color-shadow px-5"
						/>
					</Form.Group>
				</Form.Row>
			</Form>
		)}
	</Formik>
}

LoginForm.propTypes = {
	handleLogin: PropTypes.func.isRequired,
	processing: PropTypes.bool.isRequired,
	score: PropTypes.number.isRequired
}

export default LoginForm
