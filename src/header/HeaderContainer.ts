import { StoreContainer } from '@dojo/stores/StoreInjector';
import Header from './Header';
import { messageInput, submitPost, selectImage } from '../feed/FeedProcess';

export default StoreContainer(Header, 'state', {
	paths: [
		[ 'feed' ],
		[ 'post' ]
	],
	getProperties(store, properties) {
		const { get, path } = store;
		return {
			post: submitPost(store),
			onSelectImage: selectImage(store),
			onMessageInput: messageInput(store),
			message: get(path('post', 'message')),
			imageUrl: get(path('post', 'image'))
		}
	}
});
