import $api from './http'

/**
 * Get facebook feed
 *
 * @returns { Promise } - Object with data and pagination
 */

export default class NewsService {

	static async getFeed(feedURL){
		return $api.get(feedURL)
	}
}
