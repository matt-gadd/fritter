import { StoreContainer } from '@dojo/stores/StoreInjector';
import Feed from './Feed';
import { fetchPosts } from '../processes';
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
			size: 30
		}
	}
});
