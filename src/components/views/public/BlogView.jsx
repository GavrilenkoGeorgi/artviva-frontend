import React from 'react'
import { Helmet } from 'react-helmet'
import { FacebookProvider, Page } from 'react-facebook'
import { Container } from 'react-bootstrap'

const BlogView = () => {
	const windowWidth = window.innerWidth

	return <>
		<Helmet>
			<title>Блог школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Останні новини зі сторінкі у Фейсбук" />
		</Helmet>
		<Container className="text-center my-5 pb-5">
			<h1 className="custom-font my-5">Останні новини</h1>
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
	</>
}

export default BlogView
