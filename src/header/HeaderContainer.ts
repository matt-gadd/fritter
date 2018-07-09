import { StoreContainer } from '@dojo/stores/StoreInjector';
import Header from './Header';
import { captionInput, submitPost, selectImage } from '../processes';
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
			onCaptionInput: captionInput(store),
			caption: get(path('post', 'caption')),
			imageUrl: get(path('post', 'imageUrl'))
		}
	}
});
