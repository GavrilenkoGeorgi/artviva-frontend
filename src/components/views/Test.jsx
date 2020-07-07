import React from 'react'

const Test = (props) => {
	console.log('Test props', props.match.path)

	return (
		<h1>Main test router component</h1>
	)
}

export default Test

