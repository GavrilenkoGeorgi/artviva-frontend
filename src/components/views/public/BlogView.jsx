import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import { Container } from 'react-bootstrap'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { SimpleSpinner } from '../../common/spinners'
import ScrollAnimation from 'react-animate-on-scroll'

import styles from './BlogView.module.sass'

const BlogView = () => {

	const [ fetching, setFetching ] = useState(null)
	const [ facebookPosts, setFacebookPosts ] = useState([])
	const [ postsURL, setPostsURL ] = useState(null)
	const [ paging, setPaging ] = useState(null)

	// ToDo: move this somewhere
	// --- Get page access token ---
	useEffect(() => {
		const pageAccess = `https://graph.facebook.com/${process.env.REACT_APP_FACEBOOK_PAGE_ID}?fields=access_token&access_token=${process.env.REACT_APP_FACEBOOK_ACCESS_TOKEN}`
		axios.get(pageAccess).then((response) => {
			setPostsURL(`https://graph.facebook.com/v17.0/${process.env.REACT_APP_FACEBOOK_PAGE_ID}/feed?fields=message,full_picture,created_time,permalink_url&access_token=${response.data.access_token}`)
		})
	}, [])

	// and this
	useEffect(() => {
		setFetching(true)
		if (postsURL) {
			axios.get(postsURL).then(({ data: posts }) => {
				setPaging(posts.paging)
				const filtered = posts.data.filter(post => post.hasOwnProperty('message'))
				setFacebookPosts(prevState => [ ...prevState, ...filtered ])
				setFetching(false)
			})
		}
	}, [postsURL])

	const loadMore = () => {
		setPostsURL(paging.next)
	}

	const formatDate = date => {
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
			{facebookPosts.length
				? <div className={styles.postsContainer}>
						<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 1440: 2, 1920: 3 }}>
							<Masonry gutter='2.5rem'>
								{facebookPosts.map((item) => {
									return <ScrollAnimation animateIn="fadeIn" key={item.id} >
										<a href={item.permalink_url}>
											<div className={styles.post}>
												<div className={styles.imgContainer}>
													<img
														className={styles.postImg}
														src={item.full_picture}
													/>
												</div>
												<p className={styles.message}>
													{item.message}
												</p>
												<p className={styles.dateStamp}>
													{formatDate(item.created_time)}
												</p>
											</div>
										</a>
									</ScrollAnimation>
								})}
							</Masonry>
						</ResponsiveMasonry>
						<div className={styles.paginationContainer}>
							<button
								onClick={() => loadMore()}
							>
								{ fetching ? <SimpleSpinner /> : "Завантажити ще" }
							</button>
						</div>
					</div>
				: <SimpleSpinner />
			}
		</Container>
	</>
}

export default BlogView
