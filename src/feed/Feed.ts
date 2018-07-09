import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import diffProperty from '@dojo/widget-core/decorators/diffProperty';
import { auto } from '@dojo/widget-core/diff';
import Intersection from '@dojo/widget-core/meta/Intersection';

import * as css from './feed.m.css';
import Post from '../post/Post';
import PlaceholderPost from './../post/PlaceholderPost';
import { PostState, FetchPostsArguments, FavPostArguments, SubmitPostArguments } from '../interfaces';

interface FeedProperties {
	postsPayload: PostState[];
	total: number;
	size: number;
	fetch(args: FetchPostsArguments): void;
	retryPost(args: SubmitPostArguments): void;
	favPost(args: FavPostArguments): void;
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
				w(PlaceholderPost, { key: i })
			)
		}
		return placeholders;
	}

	protected render() {
		let { fetch, postsPayload, size, total, retryPost, favPost } = this.properties;
		postsPayload = postsPayload || [];
		const { isIntersecting } = this.meta(Intersection).get('bottom');
		const posts = postsPayload.map(({ id, message, highQualityUrl, lowQualityUrl, favCount, hasFailed }, key) => {
			return w(Post, { id, key, message, highQualityUrl, lowQualityUrl, favCount, hasFailed, retry: retryPost, fav: favPost })
		});

		if (isIntersecting && !this._isLoading && postsPayload.length < total) {
			this._isLoading = true;
			fetch({ offset: postsPayload.length });
		}

		return v('div',
			{ classes: [ css.root ] },
			[
				...posts,
				...(this._isLoading ? this._renderPlaceholders(postsPayload.length, size, total) : []),
				v('div', { key: 'bottom', classes: [ css.bottom ] })
			]
		);
	}
}

export default Feed;
