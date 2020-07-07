import React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'

const BtnWithSpinner = props => {
	const { waitingState,
		loadingState,
		dataCy,
		label,
		...other } = props
	const chooseSpinner = () => {
		const loadingSpinner = () => <Spinner
			as="span"
			animation="border"
			size="sm"
			role="status"
			aria-hidden="true"
		/>
		const waitingSpinner = () => <Spinner
			as="span"
			animation="grow"
			size="sm"
			role="status"
			aria-hidden="true"
		/>
		return waitingState ? waitingSpinner() : loadingState ? loadingSpinner() : null
	}

	return (
		<Button
			data-cy={dataCy}
			{ ...other }
		>
			{chooseSpinner() || label}
		</Button>
	)
}

BtnWithSpinner.propTypes = {
	type: PropTypes.string.isRequired,
	handleClick: PropTypes.func,
	loadingState: PropTypes.bool.isRequired,
	disabled: PropTypes.bool,
	waitingState: PropTypes.bool,
	label: PropTypes.string.isRequired,
	variant: PropTypes.string.isRequired,
	dataCy: PropTypes.string.isRequired,
	className: PropTypes.string
}

export default BtnWithSpinner
