import React, { useEffect, useState } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Helmet } from 'react-helmet'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { SimpleSpinner } from '../../common/spinners'
import ScrollAnimation from 'react-animate-on-scroll'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import Parallax from '../../common/layout/Parallax'
import { useWindowSize } from '../../../hooks'

import styles from './BlogView.module.sass'

const BlogView = () => {

	const [ fetching, setFetching ] = useState(null)
	const [ facebookPosts, setFacebookPosts ] = useState([])
	const [ postsURL, setPostsURL ] = useState(null)
	const [ paging, setPaging ] = useState(null)

	const [ aspect, setAspect ] = useState('6 / 3')

	const screenWidth = useWindowSize().width
	useEffect(() => {
		if (screenWidth >= 1280) {
			setAspect('6 / 1')
		}
	}, [])

	// ToDo: move this somewhere // --- Get page access token ---
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
			<title>Новини школи мистецтв «АРТ ВІВА»</title>
			<meta name="description" content="Останні новини зі сторінкі у Фейсбук" />
		</Helmet>
		<Parallax imgSrc="img/parallax/art.jpg" aspect={aspect} />
		<section className={styles.container}>
			<h1>Новини</h1>
			<div className={styles.introContainer}>
				<div className={styles.socialIconsCont}>
					<a href="https://www.facebook.com/myz.shpytky"
						alt="Фейсбук-група КЗСМО «Школа мистецтв «АРТ ВІВА»"
						aria-label="Фейсбук" target="_blank" rel="noopener noreferrer"
					>
						<FontAwesomeIcon icon={faFacebookF} />
					</a>
					<a
						href="https://www.youtube.com/@ArtViva"
						alt="Ютюб КЗСМО «Школа мистецтв «АРТ ВІВА»"
						aria-label="Інстаграм" target="_blank" rel="noopener noreferrer"
					>
						<FontAwesomeIcon icon={faYoutube} />
					</a>
					<a href="https://www.instagram.com/myz_shputky"
						alt="Інстаграм КЗСМО «Школа мистецтв «АРТ ВІВА»"
						aria-label="Інстаграм" target="_blank" rel="noopener noreferrer"
					>
						<FontAwesomeIcon icon={faInstagram} />
					</a>
				</div>
				<div className={styles.pageIntro}>
					<p>
						Ласкаво просимо до новин,
						де креативність перебуває на першому плані ;)
					</p>
					<p>
						Відкрийте для себе останні події, надихаючі
						історії та визначні досягнення наших талановитих
						учнів: художників та музикантів, артистів та
						хореографів. Досліджуйте дивовижний світ мистецтва,
						музики, театру та знайдіть натхнення для приєднання
						до нашої спільноти учнів.
					</p>
					<p className={styles.slogan}>
						Здійсни свої творчі мрії та розкрий
						свій талант разом з "Арт Віва"!
					</p>
				</div>
			</div>
			{facebookPosts.length
				? <div className={styles.postsContainer}>
						<ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 800: 2 }}>
							<Masonry gutter='2.5rem'>
								{facebookPosts.map((item) => {
									return <ScrollAnimation animateIn="fadeIn" key={item.id} >
										<a className={styles.postLink} href={item.permalink_url}>
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
												<div className={styles.postFooter}>
													<p className={styles.dateStamp}>
														{formatDate(item.created_time)}
													</p>
													<p className={styles.postCta}>
														❯❯
													</p>
												</div>
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
				: <div className={styles.spinnerCont}>
					<SimpleSpinner />
				</div>
			}
		</section>
	</>
}

export default BlogView
