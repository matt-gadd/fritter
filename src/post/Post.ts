import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import Intersection from '@dojo/widget-core/meta/Intersection';
import * as css from './post.m.css';
import { SubmitPostArguments, FavPostArguments } from '../interfaces';

interface PostProperties {
	caption: string;
	highQualityUrl: string;
	lowQualityUrl: string;
	favCount: number;
	hasFailed?: boolean;
	id: string;
	retry(args: SubmitPostArguments): void;
	fav(args: FavPostArguments): void;
}

export class Post extends WidgetBase<PostProperties> {
	private _hasLoaded = false;

	private _onFavClick() {
		const { fav, id } = this.properties;
		fav({ id });
	}

	private _onRetryClick() {
		const { id, caption, lowQualityUrl, retry } = this.properties;
		retry({ id, caption, imageUrl: lowQualityUrl });
	}

	protected render() {
		const { caption, highQualityUrl, lowQualityUrl, favCount, hasFailed } = this.properties;
		const { isIntersecting } = this.meta(Intersection).get('root');
		const footer = this.meta(Intersection).get('caption');
		const src = isIntersecting || this._hasLoaded ? highQualityUrl : lowQualityUrl;
		const isActive = footer.isIntersecting;

		if (isIntersecting && !this._hasLoaded) {
			this._hasLoaded = true;
		}

		return v('div', { key: 'root', classes: [css.root] }, [
			v('figure', { classes: [css.container] }, [
				v('div', { classes: [css.imageContainer] }, [
					v('img', { classes: [css.image], alt: caption, src }),
				]),
				v('figcaption', {
					key: 'caption',
					classes: [
						hasFailed ? css.failed : css.figCaption,
						isActive ? css.figCaptionActive : null,
						hasFailed ? css.failedActive : null
					]
				 }, [
					hasFailed
						? v('button', { classes: [ css.retryButton ], onclick: this._onRetryClick }, ['\u21BB'])
						: v('div', { classes: [css.textContainer, isActive ? css.textContainerActive : null] }, [
							v('div', { key: 'header', classes: [css.header] }, [caption]),
							v('div', { key: 'star', onclick: this._onFavClick, classes: [css.starContainer] }, [
								v('span', { classes: [css.star] }, ['\u2605']),
								v('span', { classes: [css.count] }, [`${favCount}`])
							])
						])
				])
			])
		]);
	}
}

export default Post;
