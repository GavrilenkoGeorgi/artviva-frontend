import React from 'react'
import { FacebookProvider, Page } from 'react-facebook'
import { Container } from 'react-bootstrap'

const BlogView = () => {
	const windowWidth = window.innerWidth

	return (
		<Container className="text-center">
			<h1 className="custom-font py-3 m-0">Фейсбук</h1>
			<FacebookProvider appId="2185912735037143">
				<Page href="https://www.facebook.com/myz.shpytky" tabs="timeline"
					width={windowWidth} // max 500px
					height="700" // fullscreen desktop height
					small-header="true"
					adapt-container-width="true"
					hide-cover="true"
					show-facepile="false"
				/>
			</FacebookProvider>
		</Container>
	)
}

export default BlogView
