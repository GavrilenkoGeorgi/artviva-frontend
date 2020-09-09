import React from 'react'

import moment from 'moment'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { Form, Col } from 'react-bootstrap'
import DateInput from '../../forms/components/DateInput'
import { BtnWithSpinner } from '../../common/buttons'


const DateRangeInput = ({ range, setRange }) => {

	const liqPayDateRangeSchema = Yup.object().shape({
		date_from: Yup.date()
			.min(new Date(2020, 7, 1), 'Дані про платежі доступні з серпня 2020 року.')
			.required('Введіть дату.'),
		date_to: Yup.date()
			.min(new Date(2020, 7, 2), 'Дані про платежі доступні з серпня 2020 року.')
			.required('Введіть дату.')
	})

	const InputColumn = (props) => {
		return <Col
			className="d-flex align-items-start justify-content-center"
		>
			{props.children}
		</Col>
	}

	const BtnColumn = (props) => {
		return <Col
			className="mt-3 d-flex align-items-center justify-content-center"
		>
			{props.children}
		</Col>
	}

	return <Formik
		initialValues={{
			date_from: moment(range.date_from).format('YYYY-MM-DD'),
			date_to: moment(range.date_to).format('YYYY-MM-DD')
		}}
		enableReinitialize
		onSubmit={values => {
			const range = {
				date_from: moment(values.date_from).valueOf(),
				date_to: moment(values.date_to).valueOf()
			}
			setRange(range)
		}}
		validationSchema={liqPayDateRangeSchema}
	>
		{({ handleSubmit,
			handleChange,
			handleBlur,
			values,
			touched,
			errors
		}) => (
			<Form
				id="liqpay-date-range-form"
				data-cy="liqpay-date-range-form"
				noValidate
				onSubmit={handleSubmit}
			>
				<Form.Row>
					<InputColumn>
						<DateInput
							label="Від:"
							name="date_from"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.date_from}
							touched={touched.date_from}
							errors={errors.date_from}
						/>
					</InputColumn>

					<InputColumn>
						<DateInput
							label="До:"
							name="date_to"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values.date_to}
							touched={touched.date_to}
							errors={errors.date_to}
						/>
					</InputColumn>

					<BtnColumn>
						<BtnWithSpinner
							type="submit"
							label="Завантажити"
							variant="success"
							loadingState={false}
							dataCy="search-payments-btn"
							className="max-width-btn my-3"
						/>
					</BtnColumn>
				</Form.Row>
			</Form>
		)}
	</Formik>
}

export default DateRangeInput
