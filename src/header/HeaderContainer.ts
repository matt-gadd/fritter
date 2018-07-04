import { StoreContainer } from '@dojo/stores/StoreInjector';
import Header from './Header';
import { messageInput, submitPost, selectImage } from '../processes';
import { State } from '../interfaces';

export default StoreContainer<State>(Header, 'state', {
	paths: [
		[ 'feed' ],
		[ 'post' ]
	],
	getProperties(store): Header['properties'] {
		const { get, path } = store;
		return {
			post: submitPost(store),
			onSelectImage: selectImage(store),
			onMessageInput: messageInput(store),
			message: get(path('post', 'message')),
			imageUrl: get(path('post', 'imageUrl'))
		}
	}
});
