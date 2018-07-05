import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import diffProperty from '@dojo/widget-core/decorators/diffProperty';
import { auto } from '@dojo/widget-core/diff';
import Intersection from '@dojo/widget-core/meta/Intersection';

import * as css from './feed.m.css';
import Post from '../post/Post';
import { PostState, FetchPostsArguments } from '../interfaces';

interface FeedProperties {
	isLoading: boolean;
	postsPayload: PostState[] | null;
	total: number;
	size: number;
	fetch(args: FetchPostsArguments): void;
}

export class Feed extends WidgetBase<FeedProperties> {

	@diffProperty('postsPayload', auto)
	protected _posts(previous: FeedProperties, current: FeedProperties) {
		const { fetch, postsPayload } = current;
		if (postsPayload === null) {
			fetch({ offset: 0 });
		}
	}

	private _renderPlaceholders(start: number, size: number, total: number) {
		const placeholders = [];
		const end = Math.min(total, start + size);
		for (let i = start; i < end; i++) {
			placeholders.push(
				w(Post, { key: i, message: '' })
			)
		}
		return placeholders;
	}

	protected render() {
		let { fetch, postsPayload, isLoading, size, total } = this.properties;
		postsPayload = postsPayload || [];

		const { isIntersecting } = this.meta(Intersection).get('bottom');

		const posts = postsPayload.map(({ message, high_quality_url, low_quality_url }, key) => {
			return w(Post, { key, message, high_quality_url, low_quality_url })
		});

		if (isLoading) {
			posts.push(...this._renderPlaceholders(postsPayload.length, size, total));
		}

		if (isIntersecting && !isLoading && postsPayload.length < total) {
			fetch({ offset: postsPayload.length });
		}

		return v('div',
			{ classes: css.root },
			[
				...posts,
				v('div', { key: 'bottom', classes: css.bottom })
			]
		);
	}
}

export default Feed;
