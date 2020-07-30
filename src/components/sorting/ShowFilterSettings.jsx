import React, { useEffect } from 'react'

const ShowFilterSettings = ({ labels, settings }) => {

	useEffect(() => {
		// console.log(labels, settings)
	}, [settings, labels])

	return (
		<p className="filter-selection-display">
			Meh...
		</p>
	)
}

const MemodShowFilterSettings = React.memo(ShowFilterSettings)

export default MemodShowFilterSettings