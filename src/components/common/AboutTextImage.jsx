import React from 'react'
import { Image } from 'react-bootstrap'
import PropTypes from 'prop-types'

const AboutTextImage = ({
	src,
	alt,
	width,
	maxWidth,
	float,
	classList }) => {

	const floatingStyle = {
		width: width,
		maxWidth: maxWidth,
		float: float,
	}

	return (
		<Image
			rounded
			fluid
			height="auto"
			src={src}
			alt={alt}
			style={float ? floatingStyle : null}
			className={classList}
		/>
	)
}

AboutTextImage.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	width: PropTypes.string,
	maxWidth: PropTypes.string,
	float: PropTypes.string,
	classList: PropTypes.string
}

export default AboutTextImage
