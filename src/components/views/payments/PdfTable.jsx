import React from 'react'
import moment from 'moment'

import { Table } from 'react-bootstrap'

const PdfTable = ({ data }) => {

	const calcTotals = data => {
		const total = data.reduce((a, b) => a + (b.amount || 0), 0)
		const successfulPayments = data.filter(item => item.status === 'success')
		const success = successfulPayments.reduce((acc, item) => acc + (item.amount || 0), 0)
		const result = {
			success,
			failure: total - success
		}
		return <>
			<span>{total.toFixed(2)}</span> -{' '}
			<span className="text-warning">
				{result.failure.toFixed(2)}
			</span> ={' '}
			<span className="text-success">
				<strong>
					{result.success.toFixed(2)} грн
				</strong>
			</span>
		</>
	}

	return <>
		{data.map((item, index) =>
			<Table key={item.name} striped bordered hover size="sm">
				<thead>
					<tr className="text-center">
						<th>{index + 1}</th>
						<th className="text-left">{item.name}</th>
						<th>Грн</th>
						<th>Статус</th>
					</tr>
				</thead>
				<tbody>
					{item.payments.map((item, index) =>
						<tr key={item.order_id} className="text-center">
							<td><small className="text-muted">{index + 1}</small></td>
							<td className="text-left">{moment(item.end_date).format('LLLL')}</td>
							<td className={`${item.status !== 'success' ? 'text-muted' : null} `}>
								{item.amount.toFixed(2)}
							</td>
							<td className={`${item.status === 'success' ? 'text-success' : 'text-warning'} `}>
								{item.status}
							</td>
						</tr>
					)}
					<tr>
						<td colSpan="4" className="text-right">
							{calcTotals(item.payments)}
						</td>
					</tr>
				</tbody>
			</Table>
		)}
	</>
}

export default PdfTable
