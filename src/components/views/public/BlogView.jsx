import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux' // !!!!
import { Helmet } from 'react-helmet'
import { setNotification } from '../../../reducers/notificationReducer'
import { getAccessToken, getPostsURL } from '../../../services/facebookAPI'
import { getHashtagsAndURLs, parseYtLinks } from '../../../utils/arrayHelpers'

import { SimpleSpinner } from '../../common/spinners'
import NewsFeed from '../../news/NewsFeed'
import Parallax from '../../common/layout/Parallax'
import styles from './BlogView.module.sass'
import NewsFeedLeadSection from '../../news/NewsFeedLeadSection'
import NewsService from '../../../services/news-service'

const BlogView = ({ setNotification }) => {

	const [ fetching, setFetching ] = useState(false)
	const [ facebookPosts, setFacebookPosts ] = useState([])
	const [ postsURL, setPostsURL ] = useState('')
	const [ paging, setPaging ] = useState('')

	// Get page access token
	const getPageAccessToken = async () => {
		try {
			const { data } = await getAccessToken()
			setPostsURL(getPostsURL(data.access_token))
		} catch (err){
			setNotification({
				message: 'Не вдається отримати токен доступу.',
				variant: 'warning'
			}, 15)
			console.error(err)
		}
	}

	useEffect(() => {
		getPageAccessToken()
	}, [])

	const feedData = async (postsURL) => {
		try {
			setFetching(true)
			const { data: feed } = await NewsService.getFeed(postsURL)
			const { data, paging } = feed

			setPaging(paging)
			const filtered = data.filter(post => post.hasOwnProperty('message'))

			// get hastags and or youtube links if any
			getHashtagsAndURLs(filtered)
			parseYtLinks(filtered)
			setFacebookPosts(prevState => [ ...prevState, ...filtered ])

		} catch (err) {
			// set error notification
			setNotification({
				message: 'На жаль, зараз неможливо отримати останні новини, поверніться пізніше та подивіться, чи це зміниться.',
				variant: 'warning'
			}, 15)
			console.error(err)
		} finally {
			setFetching(false)
		}
	}

	// Fetch news on url change
	useEffect(() => {
		if (postsURL) {
			feedData(postsURL)
		}
	}, [ postsURL ])

	const loadMore = () => {
		setPostsURL(paging.next)
	}

	return <>
		<Helmet>
			<title>Новини школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Останні новини зі сторінкі у Фейсбук" />
		</Helmet>
		<Parallax imgSrc="img/parallax/art.jpg" />
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

const mapStateToProps = (state) => {
	return {
		notification: state.notification
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(BlogView)
