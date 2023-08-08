import React from 'react'

import { ButtonLink } from '../common/buttons'

import styles from './QuestionnaireCTA.module.sass'

const QuestionnaireCTA = () => {

	return <>
		<h2 className={styles.bannerHeading}>Анкета для батьків</h2>
		<p>
			Допоможіть нам покращити ваш досвід у школі, поділившись своїми думками.
			Віддайте кілька хвилин, щоб повідомити нам, наскільки ми відповідаємо
			вашим очікуванням. Ваша думка допомагає нам створити ще краще
			середовище для творчого і музичного розвитку вашої дитини. Клікнить на
			кнопку, щоб відкрітити анкету.
			Дякуємо, що є частиною нашої творчої спільноти!
		</p>
		<div className={styles.cta}>
			<ButtonLink
				variant="primary"
				route="https://docs.google.com/forms/d/e/1FAIpQLSdUZJHgvXtu81sHLhckFbxPkUAvci5hRE0t_GN_fqWklIee4Q/viewform"
				label="Поділіться своїми враженнями"
				className="primary-color-shadow"
			/>
		</div>
	</>
}

export default QuestionnaireCTA
