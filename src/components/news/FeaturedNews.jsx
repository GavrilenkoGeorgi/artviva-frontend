import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { getAccessToken, getPostsURL } from '../../services/facebookAPI'
import { formatDate } from '../../utils/datesAndTime'

import styles from './FeaturedNews.module.sass'


const FeaturedNews = () => {

	const [ posts, setPosts ] = useState(null)

	// we need to get last two posts (last week posts with most shares)
	useEffect(() => {
		getAccessToken().then(({ data }) => { // move this somewhere?
			const url = getPostsURL(data.access_token)
			axios.get(url).then((response) => { // this comes from facebook api
				if (response.data.data) {
					const postsArray = response.data.data
					const shared = postsArray.filter(({ shares, message }) => message && shares?.count)
					// create hashtags
					shared.map(post => {
						const hashtags = post.message.match(/#[\p{L}]+/ugi)
						post.hashtags = hashtags || []
					})
					const taggedPosts = shared.filter(({ hashtags }) => hashtags.length)
					setPosts(() => taggedPosts.slice(-4))
				} else return null
			})
		})
	}, [])

	return <aside className={styles.featuredNews}>
		<div>
			<h2>
				Останні новини
			</h2>
		</div>
		<div className={styles.newsItems}>
			{posts && <>
				{posts.map((item) => (
					<div className={styles.postData} key={item.id}>
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
						<div className={styles.hashtags}>
							{item.hashtags.map((tag) => (
								<a
									className={styles.hashtag}
									href={`https://www.facebook.com/hashtag/${tag.slice(1)}`}
									key={tag}>
									{tag}{' '}
								</a>
							))}
						</div>
					</div>
				))}
			</>}
		</div>
	</aside>
}

export default FeaturedNews
