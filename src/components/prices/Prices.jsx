import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import specialtiesService from '../../services/specialties'
import { setNotification } from '../../reducers/notificationReducer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHryvnia } from '@fortawesome/free-solid-svg-icons'

import { Row, Col } from 'react-bootstrap'

const Prices = ({ setNotification }) => {

	const [prices, setPrices] = useState([])

	useEffect(() => {
		specialtiesService.getPrices()
			.then(data => {
				setPrices(compilePricesList(data).sort((a, b) => a.cost - b.cost))
			})
			.catch(error => {
				const { message } = { ...error.response.data }
				setNotification({
					message,
					variant: 'danger'
				}, 5)
			})
	}, [setNotification])

	const compilePricesList = data => {
		let result = data.reduce((acc, d) => {
			const found = acc.find(a => a.cost === d.cost)
			found
				? found.titles.push(d.title)
				: acc.push({ cost: d.cost, titles: [d.title], id: d.id }) // id is used only for a key
			return acc
		}, [])
		return result
	}

	return <>
		<h4 className="text-center custom-font"> {/* How about one custom header for every page?? */}
			Ціни на навчання
		</h4>
		{prices.length
			? <>
				{prices.map(item =>
					<Row key={item.id} className="py-2 price-position justify-content-end">
						<Col xs={2} className="px-1 text-center">
							<strong>{item.cost}</strong>{' '}
							<FontAwesomeIcon icon={faHryvnia} className="text-muted pr-1"/>
						</Col>
						{item.titles.map(title =>
							<Col xs={10} key={title}>{title}<br /></Col>
						)}
					</Row>
				)}
			</>
			: <>Завантажуються актуальні ціни...</>
		}
	</>
}

const mapStateToProps = (state) => {
	return {
		fetchingData: state.notification.fetchingData
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Prices)

// export default Prices