import React from 'react'

import styles from './QuestionnaireCTA.module.sass'

const QuestionnaireCTA = () => {

	return <>
		<p className={styles.message}>
			📝 Допоможіть нам покращити ваш досвід у школі, поділившись своїми думками.
			Приділить кілька хвилин, ⌚ щоб повідомити нам, наскільки ми відповідаємо
			вашим очікуванням. Ваша думка допомагає нам створити ще краще
			середовище для творчого і музичного розвитку вашої дитини.
		</p>
		<p className={styles.cta}>
			Дякуємо, що є частиною нашої творчої спільноти! 🎨🎶{' '}
			<a
				className={styles.bannerLink}
				href="https://docs.google.com/forms/d/e/1FAIpQLSdUZJHgvXtu81sHLhckFbxPkUAvci5hRE0t_GN_fqWklIee4Q/viewform"
			>
				Поділіться своїми враженнями ❯❯❯
			</a>
		</p>
	</>
}

export default QuestionnaireCTA
