import { StoreContainer } from '@dojo/stores/StoreInjector';
import Feed from './Feed';
import { fetchPosts, retryPost, favPost } from '../processes';
import { State } from '../interfaces';

export default StoreContainer<State>(Feed, 'state', {
	paths: [
		[ 'feed' ]
	],
	getProperties(store): Feed['properties'] {
		const { get, path } = store;
		return {
			isLoading: get(path('feed', 'isLoading')),
			postsPayload: get(path('feed', 'posts')) || [],
			total: get(path('feed', 'total')) || 5,
			fetch: fetchPosts(store),
			retryPost: retryPost(store),
			favPost: favPost(store),
			size: 30
		}
	}
});
