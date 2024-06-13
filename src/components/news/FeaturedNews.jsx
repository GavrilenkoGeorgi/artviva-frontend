import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'

import axios from 'axios'
import { setNotification } from '../../reducers/notificationReducer'
import { getHashtagsAndURLs } from '../../utils/arrayHelpers'
import { getAccessToken, getPostsURL } from '../../services/facebookAPI'
import { formatDate } from '../../utils/datesAndTime'

import ScrollAnimation from 'react-animate-on-scroll'
import styles from './FeaturedNews.module.sass'

const FeaturedNews = ({ setNotification }) => {

	const [ posts, setPosts ] = useState(null)

	const getNewsToShow = useCallback(async () => {
		try {
			// get data
			const { data: { access_token } } = await getAccessToken()
			const url = getPostsURL(access_token)
			const { data: { data } } = await axios.get(url)

			// sort and filter
			const items = data.filter(({ message }) => message)
			const featuredPosts = getHashtagsAndURLs(items)
			setPosts(() => featuredPosts.slice(0, 4))

		} catch (err) {
			setNotification({
				message: err.message,
				variant: 'danger'
			}, 5)
		}
	}, [setNotification])

	useEffect(() => {
		getNewsToShow()
	}, [ getNewsToShow ])

	return <aside className={styles.featuredNews}>
		<div>
			<h2>
				Останні новини
			</h2>
		</div>
		<div className={styles.newsItems}>
			{posts && <>
				{posts.map(item => (
					<ScrollAnimation
						animatePreScroll={false}
						animateOnce={true}
						animateIn="fadeInUp"
						delay={250}
						key={item.id}
					>
						<div className={styles.postData} >
							<div className={styles.dateStamp}>
								{formatDate(item.created_time)}
							</div>
							<a href={item.permalink_url}
								className={styles.cardLink}
							>
								<div className={styles.textLayout}>
									<p>
										{item.message}
									</p>
								</div>
							</a>
							<div className={styles.tags}>
								{item.hashtags.map(tag => (
									<a
										className={styles.hashtag}
										href={`https://www.facebook.com/hashtag/${tag.slice(1)}`}
										key={tag}>
										{tag}{' '}
									</a>
								))}
								{item.urls.map(url => (
									<a
										className={styles.url}
										href={url}
										key={url}>
										{url}{' '}
									</a>
								))}
							</div>
						</div>
					</ScrollAnimation>
				))}
			</>}
		</div>
	</aside>
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = {
	setNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FeaturedNews)
