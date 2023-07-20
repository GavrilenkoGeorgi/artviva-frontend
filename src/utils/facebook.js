import axios from 'axios'

export const getPageAccessToken = async () => {
	// let token
	// eslint-disable-next-line
	const pageAccessURL = `https://graph.facebook.com/${process.env.REACT_APP_FACEBOOK_PAGE_ID}?fields=access_token&access_token=${process.env.REACT_APP_FACEBOOK_ACCESS_TOKEN}`
	const response = await axios.get(pageAccessURL)/* .then((response) => {
			setPageAccessToken(response.data.access_token)
		}) */
	console.log(response)
	return response.data.access_token
}
