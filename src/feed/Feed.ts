import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import diffProperty from '@dojo/widget-core/decorators/diffProperty';
import { auto } from '@dojo/widget-core/diff';
import Intersection from '@dojo/widget-core/meta/Intersection';

import * as css from './feed.m.css';
import Post from '../post/Post';

interface PostPayload {
	message: string;
}

interface FeedProperties {
	size: number,
	fetch(args: { offset: number }): void;
	postsPayload: null | PostPayload[];
	isLoading: boolean;
}

export class Feed extends WidgetBase<FeedProperties> {

	@diffProperty('postsPayload', auto)
	protected _posts(previous: FeedProperties, current: FeedProperties) {
		const { fetch, postsPayload } = current;
		if (postsPayload === null) {
			fetch({ offset: 0 });
		}
	}

	private _renderPlaceholders(start: number, size: number) {
		const placeholders = [];
		for (let i = start; i < start + size; i++) {
			placeholders.push(
				w(Post, { key: i, message: '' })
			)
		}
		return placeholders;
	}

	protected render() {
		let { fetch, postsPayload, isLoading, size } = this.properties;
		postsPayload = postsPayload || [];

		const { isIntersecting } = this.meta(Intersection).get('bottom');

		const posts = postsPayload.map(({ message }, key) => {
			return w(Post, { key, message })
		});

		if (isLoading) {
			posts.push(...this._renderPlaceholders(postsPayload.length, size));
		}

		if (isIntersecting && !isLoading) {
			fetch({ offset: postsPayload.length });
		}

		return v('div',
			{ classes: css.root },
			[
				...posts,
				isLoading ? null : v('div', { key: 'bottom' })
			]
		);
	}
}

export default Feed;
