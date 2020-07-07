import React from 'react'
import YoutubeVideo from '../common/YoutubeVideo'

import { Container } from 'react-bootstrap'

const ShowcaseView = () => {

	const videos = [
		{
			title: 'Конкурс Ms&Mr Talent ArtViva 2019',
			src: 'https://www.youtube.com/embed/HIJqTx0oA9A'
		},
		{
			title: 'Тізер благодійного заходу "Твори добро"',
			src: 'https://www.youtube.com/embed/P9_1zTQDMbA'
		}
	]

	return (
		<Container className="border1 border-primary text-center">
			<h2 className="mb-4 custom-font">На сцені</h2>
			{videos.map(video => (
				<div key={video.src}>
					<h6 className="text-muted pb-2">
						<em>{video.title}</em>
					</h6>
					<YoutubeVideo
						key={video.src}
						title={video.title}
						src={video.src}
					/>
				</div>
			))}
		</Container>
	)
}

export default ShowcaseView
