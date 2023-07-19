import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Container } from 'react-bootstrap'
import axios from 'axios'
import moment from 'moment'

import styles from './BlogView.module.sass'

const BlogView = () => {

	const [ pageAccessToken, setPageAccessToken ] = useState(null)
	const [ facebookPosts, setFacebookPosts ] = useState([])

	// ToDo: move this somewhere
	useEffect(() => {
		const pageAccess = `https://graph.facebook.com/${process.env.REACT_APP_FACEBOOK_PAGE_ID}?fields=access_token&access_token=${process.env.REACT_APP_FACEBOOK_ACCESS_TOKEN}`
		axios.get(pageAccess).then((response) => {
			setPageAccessToken(response.data.access_token)
		})
	}, [])
	// and this
	useEffect(() => {
		if (pageAccessToken) {
			const feedURL = `https://graph.facebook.com/v17.0/${process.env.REACT_APP_FACEBOOK_PAGE_ID}/feed?fields=message,full_picture,created_time,actions,permalink_url&access_token=${pageAccessToken}`
			axios.get(feedURL).then(({ data: posts}) => {
				const filtered = posts.data.filter(post => post.hasOwnProperty('message'))
				console.log(filtered)
				setFacebookPosts(filtered)
			})
		}
	}, [pageAccessToken])

	const formatDate = date => {
		console.log('Format: ', date)
		const result = moment(date).format('LL')
		return result
	}

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
								return <a href={item.permalink_url} key={item.id}>
									<div className={styles.post}>
										<p className={styles.dateStamp}>{formatDate(item.created_time)}</p>
										<div className={styles.imgContainer}>
											<img className={styles.postImg} src={item.full_picture} />
										</div>
										<p className={styles.message}>{item.message}</p>
									</div>
								</a>
							})}
						</div>
					: <div>loading...</div>
				}
			</article>
		</Container>
	</>
}

export default BlogView
