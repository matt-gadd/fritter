import { StoreContainer } from '@dojo/stores/StoreInjector';
import Feed from './Feed';
import { fetchPosts } from './FeedProcess';

export default StoreContainer(Feed, 'state', {
	paths: [
		[ 'feed' ]
	],
	getProperties(store, properties) {
		const { get, path } = store;
		return {
			isLoading: get(path('feed', 'isLoading')),
			postsPayload: get(path('feed', 'posts')) || null,
			fetch: fetchPosts(store),
			size: 30
		}
	}
});
