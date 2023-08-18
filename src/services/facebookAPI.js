import axios from 'axios'

const getAccessToken = () => {
	// eslint-disable-next-line
	return axios.get(`https://graph.facebook.com/${process.env.REACT_APP_FACEBOOK_PAGE_ID}?fields=access_token&access_token=${process.env.REACT_APP_FACEBOOK_ACCESS_TOKEN}`)
}

const getPostsURL = ( access_token ) => {
	// eslint-disable-next-line
	return `https://graph.facebook.com/v17.0/${process.env.REACT_APP_FACEBOOK_PAGE_ID}/feed?fields=message,full_picture,created_time,permalink_url,shares&access_token=${access_token}`
}

export { getAccessToken, getPostsURL }
