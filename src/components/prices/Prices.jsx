import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import specialtiesService from '../../services/specialties'
import { setNotification } from '../../reducers/notificationReducer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHryvnia } from '@fortawesome/free-solid-svg-icons'

import styles from './Prices.module.sass'

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
			const found = acc.find(a => Math.trunc(a.cost) === Math.trunc(d.cost))
			found
				? found.titles.push(d.title)
				: acc.push({ cost: (d.cost + (d.cost * process.env.REACT_APP_CENTS_AMOUNT))
					.toFixed(2), titles: [d.title], id: d.id })
			return acc
		}, [])
		return result
	}

	return <>
		<h4 className="text-center custom-font"> {/* How about one custom header for every page?? */}
			Ціни на навчання
		</h4>
		<p className="text-center mt-2 mb-3">
			<em className="text-muted">При <a href='/pay/form'>оплаті</a> через сайт.</em>
		</p>
		{prices.length
			? <>
				{prices.map(item =>
					<div key={item.id} className={styles.pricePosition}>
						<div className={styles.price}>
							<strong>{item.cost}</strong>&nbsp;<FontAwesomeIcon icon={faHryvnia} className="text-muted"/>
						</div>
						<div>
							{item.titles.map(title =>
								<div key={title} className={styles.specName}>• {title}</div>
							)}
						</div>
					</div>
				)}
			</>
			: <div>
				<em className="p-3">
					Зачекайте, завантажуються актуальні ціни...
				</em>
			</div>
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
