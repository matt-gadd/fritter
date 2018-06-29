import { createProcess } from '@dojo/stores/process';
import { replace } from '@dojo/stores/state/operations';
import { createCommandFactory } from '@dojo/stores/process';

const createCommand = createCommandFactory<any>();

export const fetchPosts = createProcess('fetch-feed', [
	createCommand<any>(({ get, path, payload }) => {
		return [
			replace(path('feed', 'isLoading'), true),
		];
	}),
	createCommand<any>(async ({ get, path, payload }) => {
		const { offset } = payload;
		const url = `https://fritter-server-pddxbnoezn.now.sh/messages?offset=${offset}`;
		const response = await fetch(`${url}`);
		const json = await response.json();
		const posts = get(path('feed', 'posts')) || [];
		return [
			replace(path('feed', 'posts'), [ ...posts, ...json ]),
			replace(path('feed', 'isLoading'), false)
		];
	}),
]);

export const addPost = createProcess('add-post', [
	createCommand<any>(({ get, path, payload }) => {
		const posts = get(path('feed', 'posts')) || [];
		return [
			replace(path('feed', 'posts'), [ JSON.parse(payload), ...posts ])
		];
	}),
]);
