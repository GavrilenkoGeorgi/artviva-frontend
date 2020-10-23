import React, { useState, useEffect } from 'react'
import getPaymentDataFromString from '../../../utils/parsePaymentDescr'
import { nestedSort } from '../../../utils/arrayHelpers'

import { Container, Row, Col } from 'react-bootstrap'
import { Button } from '../../../components/common/buttons'
import PdfTable from './PdfTable'

const PupilsReport = ({ data }) => {

	const [report, setReport] = useState([])

	// reset report on data change
	useEffect(() => {
		setReport([])
	}, [data])

	const generateReport = () => {
		let resultingTotalByPupil = []
		if (data.length > 0) {
			const names = data.map(item => (getPaymentDataFromString(item.description).pupil))
			const uniqueNames = [ ...new Set(names)]
			for (let name of uniqueNames) {
				const currentNamePayments =
					data.filter(item => getPaymentDataFromString(item.description).pupil === name)
				resultingTotalByPupil.push({ name, payments: currentNamePayments })
			}
		}
		return resultingTotalByPupil
	}

	return <Container className="mt-3">
		<Row>
			<Col xs={12} className="px-0">
				{report.length
					? <><PdfTable data={report}/></>
					: <p className="mt-4 text-center text-muted">
						<em>Ви можете сформувати звіт для учнів, натиснувши кнопку нижче.</em>
					</p>
				}
			</Col>
			<Col xs={12} className="my-4 text-center">
				<Button
					label="Сформувати звіт по учням"
					dataCy="create-pupils-report-btn"
					onClick={() => setReport(generateReport().sort(nestedSort('name')))}
					type="button"
					disabled={report.length}
					variant={report ? 'outline-primary' : 'primary'}
				/>
			</Col>
		</Row>
	</Container>
}

const MemodPupilsReport = React.memo(PupilsReport)
export default MemodPupilsReport
