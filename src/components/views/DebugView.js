import React from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, Button, InputGroup, Form } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'

const DebugView = () => {
	const schema = yup.object().shape({
		firstName: yup.string()
			.min(2, 'Too Short!')
			.max(5, 'Too Long!')
			.required('Required'),
		lastName: yup.string().required(),
		username: yup.string().required(),
		city: yup.string().required(),
		state: yup.string().required(),
		zip: yup.string().required(),
		terms: yup.bool().required(),
	})

	return (
		<Container className="p-4">
			<Row>
				<Formik
					validationSchema={schema}
					onSubmit={values => {
						// same shape as initial values
						console.log(values)
					}}
					initialValues={{
						firstName: '',
						lastName: '',
					}}
				>
					{({
						handleSubmit,
						handleChange,
						handleBlur,
						values,
						touched,
						isValid,
						errors,
					}) => (
						<Form noValidate onSubmit={handleSubmit}>
							<Form.Row>
								<Form.Group as={Col} md="4" controlId="validationFormik01">
									<Form.Label>First name</Form.Label>
									<Form.Control
										type="text"
										name="firstName"
										value={values.firstName}
										onChange={handleChange}
										isValid={touched.firstName && !errors.firstName}
									/>
									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} md="4" controlId="validationFormik02">
									<Form.Label>Last name</Form.Label>
									<Form.Control
										type="text"
										name="lastName"
										value={values.lastName}
										onChange={handleChange}
										isValid={touched.lastName && !errors.lastName}
									/>

									<Form.Control.Feedback>Looks good!</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} md="4" controlId="validationFormikUsername">
									<Form.Label>Username</Form.Label>
									<InputGroup>
										<InputGroup.Prepend>
											<InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
										</InputGroup.Prepend>
										<Form.Control
											type="text"
											placeholder="Username"
											aria-describedby="inputGroupPrepend"
											name="username"
											value={values.username}
											onChange={handleChange}
											isInvalid={!!errors.username}
										/>
										<Form.Control.Feedback type="invalid">
											{errors.username}
										</Form.Control.Feedback>
									</InputGroup>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={Col} md="6" controlId="validationFormik03">
									<Form.Label>City</Form.Label>
									<Form.Control
										type="text"
										placeholder="City"
										name="city"
										value={values.city}
										onChange={handleChange}
										isInvalid={!!errors.city}
									/>

									<Form.Control.Feedback type="invalid">
										{errors.city}
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} md="3" controlId="validationFormik04">
									<Form.Label>State</Form.Label>
									<Form.Control
										type="text"
										placeholder="State"
										name="state"
										value={values.state}
										onChange={handleChange}
										isInvalid={!!errors.state}
									/>
									<Form.Control.Feedback type="invalid">
										{errors.state}
									</Form.Control.Feedback>
								</Form.Group>
								<Form.Group as={Col} md="3" controlId="validationFormik05">
									<Form.Label>Zip</Form.Label>
									<Form.Control
										type="text"
										placeholder="Zip"
										name="zip"
										value={values.zip}
										onChange={handleChange}
										isInvalid={!!errors.zip}
									/>

									<Form.Control.Feedback type="invalid">
										{errors.zip}
									</Form.Control.Feedback>
								</Form.Group>
							</Form.Row>
							<Form.Group>
								<Form.Check
									required
									name="terms"
									label="Agree to terms and conditions"
									onChange={handleChange}
									isInvalid={!!errors.terms}
									feedback={errors.terms}
									id="validationFormik0"
								/>
							</Form.Group>
							<Button type="submit">Submit form</Button>
						</Form>
					)}
				</Formik>
			</Row>
		</Container>
	)
}

const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(DebugView)
