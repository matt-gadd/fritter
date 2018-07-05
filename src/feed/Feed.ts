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
	postsPayload: PostState[];
	total: number;
	size: number;
	fetch(args: FetchPostsArguments): void;
}

export class Feed extends WidgetBase<FeedProperties> {

	private _isLoading = false;

	@diffProperty('postsPayload', auto)
	protected _posts(previous: FeedProperties, current: FeedProperties) {
		const { fetch, postsPayload } = current;
		if (postsPayload.length === 0) {
			this._isLoading = true;
			fetch({ offset: 0 });
		} else if (previous.postsPayload.length < current.postsPayload.length) {
			this._isLoading = false;
		}
	}

	private _renderPlaceholders(start: number, size: number, total: number) {
		const placeholders = [];
		const end = Math.min(total, start + size);
		for (let i = start; i < end; i++) {
			placeholders.push(
				v('div', { key: i, classes: [ css.placeholder ] })
			)
		}
		return placeholders;
	}

	protected render() {
		let { fetch, postsPayload, size, total } = this.properties;
		postsPayload = postsPayload || [];

		const { isIntersecting } = this.meta(Intersection).get('bottom');

		const posts = postsPayload.map(({ message, high_quality_url, low_quality_url }, key) => {
			return w(Post, { key, message, high_quality_url, low_quality_url })
		});

		if (this._isLoading) {
			posts.push(...this._renderPlaceholders(postsPayload.length, size, total));
		}

		if (isIntersecting && !this._isLoading && postsPayload.length < total) {
			this._isLoading = true;
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
