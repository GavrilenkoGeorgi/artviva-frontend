import React from 'react'

import { Formik } from 'formik'
import * as Yup from 'yup'
import { Col, Form } from 'react-bootstrap'

import { TextInput } from '../forms/components'
import { BtnWithSpinner } from '../common/buttons'
import ResetBtn from './buttons/Reset'

const PaymentDescrForm = ({ payment, update, processing }) => {

	console.log('Processing', processing)

	const paymentDescrSchema = Yup.object().shape({
		pupil: Yup.string()
			.min(2, 'Не менш 2 символів.')
			.max(128, 'Максимум 128 символів.')
			.required('Введіть прізвище та повне ім\'я учня.'),
	})

	return (
		<Formik
			initialValues={{
				pupil: payment.paymentDescr.pupil, // (
			}}
			onSubmit={async (values) => {
				update(values)
			}}
			validationSchema={paymentDescrSchema}
		>
			{({ handleSubmit,
				handleChange,
				handleBlur,
				handleReset,
				values,
				touched,
				errors
			}) => (
				<Form
					data-cy="payment-descr-form"
					noValidate
					onSubmit={handleSubmit}
				>
					<Form.Row>
						<TextInput
							label="Ім'я учня"
							name="pupil"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.pupil}
							touched={touched.pupil}
							errors={errors.pupil}
						/>
					</Form.Row>

					<Form.Row>
						{/* Button */}
						<Form.Group
							as={Col}
							className="pt-4 px-0 d-flex justify-content-end"
						>
							<BtnWithSpinner
								loadingState={processing}
								className="px-4 default-width-btn"
								variant="success"
								type="submit"
								label="Зберегти"
								dataCy="update-payment-descr-btn"
							/>
							<ResetBtn
								label="Очистити"
								variant="light"
								dataCy="payment-descr-form-reset"
								onClick={handleReset}
								className="ml-2 default-width-btn"
							/>
						</Form.Group>
					</Form.Row>
				</Form>
			)}
		</Formik>
	)
}

export default PaymentDescrForm
