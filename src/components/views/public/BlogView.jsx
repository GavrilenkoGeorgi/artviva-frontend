import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Container } from 'react-bootstrap'
import axios from 'axios'

import styles from './BlogView.module.sass'

const BlogView = () => {

	const [ pageAccessToken, setPageAccessToken ] = useState(null)
	const [ facebookPosts, setFacebookPosts ] = useState([])

	useEffect(() => {
		const pageAccess = `https://graph.facebook.com/${process.env.REACT_APP_FACEBOOK_PAGE_ID}?fields=access_token&access_token=${process.env.REACT_APP_FACEBOOK_ACCESS_TOKEN}`
		axios.get(pageAccess).then((response) => {
			setPageAccessToken(response.data.access_token)
		})
	}, [])

	useEffect(() => {
		if (pageAccessToken) {
			const feedURL = `https://graph.facebook.com/v2.2/${process.env.REACT_APP_FACEBOOK_PAGE_ID}/feed?fields=message,full_picture&access_token=${pageAccessToken}`
			axios.get(feedURL).then(({ data: posts}) => {
				setFacebookPosts(posts.data)
			})
		}
	}, [pageAccessToken])

	return <>
		<Helmet>
			<title>Блог школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Останні новини зі сторінкі у Фейсбук" />
		</Helmet>
		<Container className="text-center my-5 pb-5">
			<h1 className="custom-font my-5">Останні новини</h1>
			<article>
				{facebookPosts.length
					? <div className={styles.postsContainer}>
							{facebookPosts.map((item) => {
								return <div key={item.id}>
									<p>{item.message}</p>
									<img src={item.full_picture} />
								</div>
							})}
						</div>
					: <div>loading...</div>
				}
			</article>
		</Container>
	</>
}

export default BlogView
