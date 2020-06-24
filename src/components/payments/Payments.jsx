import React from 'react'
// import { connect } from 'react-redux'

import { Container } from 'react-bootstrap'
import PaymentsList from '../payments/PaymentsList'

const Payments = () => {

	return (
		<Container>
			<PaymentsList />
		</Container>
	)
}

/*
const mapStateToProps = (state) => {
	return {
		user: state.user
	}
}

export default connect(
	mapStateToProps
)(Payments)
*/

export default Payments