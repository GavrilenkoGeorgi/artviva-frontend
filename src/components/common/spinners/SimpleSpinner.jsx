import React from 'react'
import PropTypes from 'prop-types'

import { Spinner } from 'react-bootstrap'

const SimpleSpinner = props => {
	const { animation, variant, ...rest } = props
	return (
		<Spinner
			animation={animation || 'border'}
			variant={variant || 'primary'}
			{...rest}
		/>
	)
}

SimpleSpinner.propTypes = {
	props: PropTypes.shape({
		animation: PropTypes.string.isRequired,
		variant: PropTypes.string
	})
}

const MemodSimpleSpinner = React.memo(SimpleSpinner)

export default MemodSimpleSpinner