import { createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { createCommandFactory } from '@dojo/stores/process';
import uuid from '@dojo/core/uuid';
import { State, FeedState, FetchPostsArguments, PostState, SelectImageArguments, MessageInputArguments, SubmitPostArguments } from './interfaces';

const createCommand = createCommandFactory<State>();

export const fetchPosts = createProcess<State, FetchPostsArguments>('fetch-feed', [
	createCommand(({ path }) => {
		return [
			replace(path('feed', 'isLoading'), true),
		];
	}),
	createCommand(async ({ get, path, payload: { offset } }) => {
		const url = `https://fritter-server.now.sh/messages?offset=${offset}`;
		const response = await fetch(`${url}`);
		const json: FeedState = await response.json();
		const posts = get(path('feed', 'posts')) || [];
		return [
			replace(path('feed', 'posts'), [...posts, ...json.posts]),
			replace(path('feed', 'total'), json.total),
			replace(path('feed', 'isLoading'), false)
		];
	}),
]);

export const addPost = createProcess<State, PostState>('add-post', [
	createCommand(({ get, path, payload: newPost }) => {
		let posts = get(path('feed', 'posts')) || [];
		let postIndex = -1;
		posts.some((post, index) => {
			if (newPost.id === post.id) {
				postIndex = index;
				return true;
			}
			return false;
		});
		if (postIndex !== -1) {
			posts = [...posts];
			posts[postIndex] = newPost;
		} else {
			posts = [newPost, ...posts];
		}

		return [
			replace(path('feed', 'posts'), posts)
		];
	})
]);

export const selectImage = createProcess('select-image', [
	createCommand<SelectImageArguments>(async ({ get, path, payload }) => {
		const file = payload.file;
		const promise = new Promise<string>((resolve) => {
			const fileReader = new FileReader();
			fileReader.addEventListener('load', () => {
				resolve(fileReader.result);
			});
			fileReader.readAsDataURL(file);
		});
		const result = await promise;
		return [
			replace(path('post', 'imageUrl'), result)
		];
	})
]);

export const messageInput = createProcess('message-input', [
	createCommand<MessageInputArguments>(({ get, path, payload }) => {
		return [
			replace(path('post', 'message'), payload.message)
		];
	})
]);

export const submitPost = createProcess<State, SubmitPostArguments>('fetch-feed', [
	createCommand(({ get, path }) => {
		const posts = get(path('feed', 'posts')) || [];
		const image = get(path('post', 'imageUrl'));
		const message = get(path('post', 'message'));
		const id = uuid();

		return [
			replace(path('post', 'id'), id),
			replace(path('feed', 'posts'), [{ id, highQuality_url: image, lowQuality_url: image, favCount: 0, message }, ...posts])
		];
	}),
	createCommand(({ get, path }) => {
		return [
			replace(path('post', 'message'), ''),
			replace(path('post', 'imageUrl'), '')
		];
	}),
	createCommand(async ({ get, path, payload: { file, message } }) => {
		const id = get(path('post', 'id'));
		const formData = new FormData();

		formData.append('message', message);
		formData.append('image', file);
		formData.append('id', id);

		await fetch('https://fritter-server.now.sh/messages/upload', {
			method: 'POST',
			body: formData
		});
		return [];
	}),
]);
