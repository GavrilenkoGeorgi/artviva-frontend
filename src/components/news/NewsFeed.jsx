import React from 'react'
import PropTypes from 'prop-types'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import ScrollAnimation from 'react-animate-on-scroll'

import { formatDate } from '../../utils/datesAndTime'
import YoutubeEmbed from './YoutubeEmbed'
import { SimpleSpinner } from '../common/spinners'
import styles from './NewsFeed.module.sass'
import newsStyles from '../../components/news/FeaturedNews.module.sass'

const NewsFeed = (props) => {

	return <div className={styles.postsContainer}>
		<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 800: 2 }}  >
			<Masonry gutter='2.5rem'>
				{props.feed.map((item) => {
					return <ScrollAnimation animateIn="fadeInUp" key={item.id} animateOnce>
						<div className={styles.post}>
							<a className={styles.postLink} href={item.permalink_url}>
								{item.ytId
									? <YoutubeEmbed embedId={item.ytId} />
									: <div className={styles.imgContainer}>
										<img
											className={styles.postImg}
											src={item.full_picture}
										/>
									</div>
								}
								<pre className={styles.message}>
									{item.message}
								</pre>
							</a>
							<div className={newsStyles.hashtags}>
								{item.hashtags.map(tag => (
									<a
										className={newsStyles.hashtag}
										href={`https://www.facebook.com/hashtag/${tag.slice(1)}`}
										key={tag}>
										{tag}{' '}
									</a>
								))}
							</div>
							<div className={styles.postFooter}>
								<p className={styles.dateStamp}>
									{formatDate(item.created_time)}
								</p>
								<a href={item.permalink_url}>
									<p className={styles.postCta}>
										❯❯
									</p>
								</a>
							</div>
						</div>
					</ScrollAnimation>
				})}
			</Masonry>
		</ResponsiveMasonry>
		<div className={styles.paginationContainer}>
			<button
				onClick={() => props.loadMore()}
			>
				{ props.fetching ? <SimpleSpinner /> : 'Завантажити ще' }
			</button>
		</div>
	</div>
}

NewsFeed.propTypes = {
	feed: PropTypes.array,
	fetching: PropTypes.bool,
	loadMore: PropTypes.func
}

export default NewsFeed
