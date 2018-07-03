import { createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { createCommandFactory } from '@dojo/stores/process';
import uuid from '@dojo/core/uuid';

const createCommand = createCommandFactory<any>();

export const fetchPosts = createProcess('fetch-feed', [
	createCommand<any>(({ get, path, payload }) => {
		return [
			replace(path('feed', 'isLoading'), true),
		];
	}),
	createCommand<any>(async ({ get, path, payload }) => {
		const { offset } = payload;
		const url = `https://fritter-server.now.sh/messages?offset=${offset}`;
		const response = await fetch(`${url}`);
		const json = await response.json();
		const posts = get(path('feed', 'posts')) || [];
		return [
			replace(path('feed', 'posts'), [...posts, ...json.posts]),
			replace(path('feed', 'total'), [...posts, ...json.total]),
			replace(path('feed', 'isLoading'), false)
		];
	}),
]);

export const addPost = createProcess('add-post', [
	createCommand<any>(({ get, path, payload }) => {
		let posts = get(path('feed', 'posts')) || [];
		let postIndex = -1;
		const newPost = JSON.parse(payload);
		posts.some((post: any, index: number) => {
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
	createCommand<any>(async ({ get, path, payload }) => {
		const file = payload.file;
		const promise = new Promise((resolve) => {
			const fileReader = new FileReader();
			fileReader.addEventListener('load', () => {
				resolve(fileReader.result);
			});
			fileReader.readAsDataURL(file);
		});
		const result = await promise;
		return [
			replace(path('post', 'image'), result)
		];
	})
]);

export const messageInput = createProcess('message-input', [
	createCommand<any>(({ get, path, payload }) => {
		return [
			replace(path('post', 'message'), payload.message)
		];
	})
]);

export const submitPost = createProcess('fetch-feed', [
	createCommand(({ get, path, payload }) => {
		const posts = get(path('feed', 'posts')) || [];
		const image = get(path('post', 'image'));
		const message = get(path('post', 'message'));
		const id = uuid();

		return [
			replace(path('post', 'id'), id),
			replace(path('feed', 'posts'), [{ id, high_quality_url: image, low_quality_url: image, message }, ...posts])
		];
	}),
	createCommand<any>(async ({ get, path, payload }) => {
		const { file, message } = payload;
		const id = get(path('post', 'id'));
		const formData = new FormData();

		formData.append('message', message);
		formData.append('image', file);
		formData.append('id', id);
		const url = 'https://fritter-server.now.sh/messages/upload';
		await fetch(url, {
			method: 'POST',
			body: formData
		});

		return [
			replace(path('post', 'message'), ''),
			replace(path('post', 'image'), '')
		];
	}),
]);
