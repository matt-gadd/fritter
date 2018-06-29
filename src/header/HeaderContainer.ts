import { StoreContainer } from '@dojo/stores/StoreInjector';
import Header from './Header';
import { submitPost } from '../feed/FeedProcess';

export default StoreContainer(Header, 'state', {
	paths: [
		[ 'feed' ]
	],
	getProperties(store, properties) {
		return {
			post: submitPost(store)
		}
	}
});
