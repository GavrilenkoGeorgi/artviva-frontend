import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux' // !!!!
import { Helmet } from 'react-helmet'
import { useWindowSize } from '../../../hooks'
import { setNotification } from '../../../reducers/notificationReducer'
import { getAccessToken, getPostsURL } from '../../../services/facebookAPI'
import { getHashtags, parseYtLInks } from '../../../utils/arrayHelpers'

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

	const feedData = async (postsURL) => {
		try {
			setFetching(true)
			const { data: feed } = await NewsService.getFeed(postsURL)
			const { data, paging } = feed

			setPaging(paging)
			const filtered = data.filter(post => post.hasOwnProperty('message'))

			// get hastags and or youtube links if any
			getHashtags(filtered)
			parseYtLInks(filtered)
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
		<Parallax imgSrc="img/parallax/art.jpg" aspect={aspect} />
		<section className={styles.container}>
			<h1>Новини</h1>
			<NewsFeedLeadSection />
			{facebookPosts.length > 0
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
