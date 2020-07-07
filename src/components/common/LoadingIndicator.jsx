import React from 'react'
import { Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'

const LoadingIndicator = ({ animation, variant, size }) => {
	return (
		<div className="position-center loading-background">
			<Spinner
				animation={animation}
				variant={variant || ''}
				role="status"
				size={size || 'lg'}
				className="loading-spinner"
			>
				<span className="sr-only">Завантаження...</span>
			</Spinner>
		</div>
	)
}

LoadingIndicator.propTypes = {
	animation: PropTypes.string.isRequired,
	variant: PropTypes.string,
	size: PropTypes.string
}

export default LoadingIndicator
