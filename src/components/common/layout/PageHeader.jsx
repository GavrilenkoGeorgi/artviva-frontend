import React from 'react'

import { array } from 'prop-types'

const PageHeader = ({ children, ...rest }) => {
	return <h1 { ...rest }>
		{children}
	</h1>
}

PageHeader.propTypes = {
	rest: array
}

export default PageHeader
