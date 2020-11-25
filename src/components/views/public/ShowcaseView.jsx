import React from 'react'
import YoutubeVideo from '../../common/YoutubeVideo'

import { Container } from 'react-bootstrap'

const ShowcaseView = () => {

	const videos = [
		{
			title: 'The Sixsters – Крила (official video 2020)',
			src: 'https://www.youtube.com/embed/9-GkJHPO2Qc'
		},
		{
			title: 'РАЙСЬКИЙ САД 2020 реж. Олена Завгородня',
			src: 'https://www.youtube.com/embed/IFYIU5LOZic'
		},
		{
			title: '29! В ритмі серця України!',
			src: 'https://www.youtube.com/embed/eWV_SISJMFs'
		},
		{
			title: 'Тізер конкурсу Ms&Mr Talent ArtViva 2019',
			src: 'https://www.youtube.com/embed/HIJqTx0oA9A'
		},
		{
			title: 'Тізер благодійного заходу "Твори добро"',
			src: 'https://www.youtube.com/embed/P9_1zTQDMbA'
		}
	]

	return (
		<Container className="border1 border-primary text-center">
			<h1 className="pt-3 mb-4 custom-font">На сцені</h1>
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
