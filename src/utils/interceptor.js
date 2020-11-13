import axios from 'axios'

const showNotification = (store, message, variant) => {
	store.dispatch ({
		type: 'SET_NOTIFICATION',
		message,
		variant: variant || 'danger'
	})
	setTimeout(() => {
		store.dispatch ({
			type: 'CLOSE_NOTIFICATION'
		})
	}, 5000)
}

const interceptor = store => {
	axios.interceptors.response.use((response) => {
		return response
	}, (error) => {
		console.log('Response error: ', error.message)
		console.error(error)

		const { message, variant } = { ...error.response.data }
		showNotification(
			store,
			message || `На жаль, під час обробки вашого запиту сталася помилка: ${error.message}`,
			variant)
		return Promise.reject(error)
	})

	axios.interceptors.request.use(config => {
		return config
	}, (error) => {
		console.log('Request error: ', error.message)
		console.error(error)

		showNotification(store,
			`На жаль, під час обробки вашого запиту сталася помилка: ${error.message}`)
		return Promise.reject(error)
	})

}

export default { interceptor }
