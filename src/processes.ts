import { createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { createCommandFactory } from '@dojo/stores/process';
import uuid from '@dojo/core/uuid';
import {
	State,
	FeedState,
	FetchPostsArguments,
	PostState,
	SelectImageArguments,
	MessageInputArguments,
	SubmitPostArguments,
	RetrySubmitArguments
} from './interfaces';

const createCommand = createCommandFactory<State>();

function findPostIndex(posts: PostState[], id: string) {
	let postIndex = -1;
	posts.some((post, index) => {
		if (post.id === id) {
			postIndex = index;
			return true;
		}
		return false;
	});
	return postIndex;
}

const submitPostCommand = createCommand<SubmitPostArguments>(async ({ get, path, at, payload: { id, imageUrl, message } }) => {
	id = id || get(path('post', 'id'));
	const posts = get(path('feed', 'posts')) || [];
	const index = findPostIndex(posts, id);
	const postPath = at(path('feed', 'posts'), index);
	const post = get(postPath);
	const formData = new FormData();

	const fileRes = await fetch(imageUrl);
	const buffer = await fileRes.arrayBuffer();
	const file = new File([buffer], 'filename');

	formData.append('message', message);
	formData.append('image', file);
	formData.append('id', id);

	const response = await fetch('https://fritter-server.now.sh/messages/upload', {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		if (post) {
			return [
				replace(postPath, { ...post, hasFailed: true })
			]
		}
	}

	return [
		replace(postPath, { ...post, hasFailed: false })
	];
})

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

export const fetchPosts = createProcess<State, FetchPostsArguments>('fetch-feed', [
	createCommand(async ({ get, path, payload: { offset } }) => {
		const url = `https://fritter-server.now.sh/messages?offset=${offset}`;
		const response = await fetch(`${url}`);
		const json: FeedState = await response.json();
		const posts = get(path('feed', 'posts')) || [];
		return [
			replace(path('feed', 'posts'), [...posts, ...json.posts]),
			replace(path('feed', 'total'), json.total)
		];
	}),
]);

export const addPost = createProcess<State, PostState>('add-post', [
	createCommand(({ get, path, at, payload: newPost }) => {
		let posts = get(path('feed', 'posts')) || [];
		const index = findPostIndex(posts, newPost.id);
		if (index !== -1) {
			return [
				replace(at(path('feed', 'posts'), index), newPost)
			];
		}
		return [
			replace(path('feed', 'posts'), [ newPost, ...posts ])
		];
	})
]);

export const favPost = createProcess('fav-post', [
	createCommand(({ get, path, at, payload: { id } }) => {
		let posts = get(path('feed', 'posts')) || [];
		const index = findPostIndex(posts, id);
		if (index !== -1) {
			const post = get(at(path('feed', 'posts'), index));
			return [
				replace(at(path('feed', 'posts'), index), { ...post, favCount: post.favCount + 1 })
			]
		}
		return [];
	}),
	createCommand(async ({ get, path, payload: { id } }) => {
		await fetch(`https://fritter-server.now.sh/messages/${id}/fav`, {
			method: 'POST'
		});
		return [];
	})
], (error, options) => {
	if (error) {
		options.apply(options.undoOperations, true);
	}
});

export const submitPost = createProcess<State, SubmitPostArguments>('fetch-feed', [
	createCommand(({ get, path }) => {
		const posts = get(path('feed', 'posts')) || [];
		const image = get(path('post', 'imageUrl'));
		const message = get(path('post', 'message'));
		const id = uuid();

		return [
			replace(path('post', 'id'), id),
			replace(path('feed', 'posts'), [{ id, highQualityUrl: image, lowQualityUrl: image, favCount: 0, message }, ...posts])
		];
	}),
	createCommand(({ get, path }) => {
		return [
			replace(path('post', 'message'), ''),
			replace(path('post', 'imageUrl'), '')
		];
	}),
	submitPostCommand
]);

export const retryPost = createProcess<State, RetrySubmitArguments>('retry-post', [submitPostCommand]);
