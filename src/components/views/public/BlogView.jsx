import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import { useWindowSize } from '../../../hooks'
import { getAccessToken, getPostsURL } from '../../../services/facebookAPI'
import { getHashtags, parseYtLInks } from '../../../utils/arrayHelpers'

import { SimpleSpinner } from '../../common/spinners'
import NewsFeed from '../../news/NewsFeed'
import Parallax from '../../common/layout/Parallax'
import styles from './BlogView.module.sass'
import NewsFeedLeadSection from '../../news/NewsFeedLeadSection'

const BlogView = () => {

	const [ fetching, setFetching ] = useState(null)
	const [ facebookPosts, setFacebookPosts ] = useState([])
	const [ postsURL, setPostsURL ] = useState(null)
	const [ paging, setPaging ] = useState(null)

	// parallax
	const [ aspect, setAspect ] = useState('4 / 3')
	const screenWidth = useWindowSize().width

	useEffect(() => {
		if (screenWidth >= 500) setAspect('16 / 9')
		if (screenWidth >= 1280) setAspect('16 / 4')
	}, [])

	// Get page access token
	useEffect(() => {
		getAccessToken().then(({ data }) => {
			setPostsURL(getPostsURL(data.access_token))
		})
	}, [])

	// Fetch news on url change
	useEffect(() => {
		setFetching(true)
		if (postsURL) {
			axios.get(postsURL).then(({ data: posts }) => {
				setPaging(posts.paging)
				const filtered = posts.data.filter(post => post.hasOwnProperty('message'))

				// get hastags and or youtube links if any
				getHashtags(filtered)
				parseYtLInks(filtered)

				setFacebookPosts(prevState => [ ...prevState, ...filtered ])
				setFetching(false)
			})
		}
	}, [postsURL])

	const loadMore = () => {
		setPostsURL(paging.next)
	}

	return <>
		<Helmet>
			<title>Новини школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Останні новини зі сторінкі у Фейсбук" />
		</Helmet>
		<Parallax imgSrc="img/parallax/art.jpg" aspect={aspect} />
		<section className={styles.container}>
			<h1>Новини</h1>
			<NewsFeedLeadSection />
			{facebookPosts.length
				? <NewsFeed
						feed={facebookPosts}
						fetching={fetching}
						loadMore={loadMore}
					/>
				: <div className={styles.spinnerCont}>
					<SimpleSpinner />
				</div>
			}
		</section>
	</>
}

export default BlogView
