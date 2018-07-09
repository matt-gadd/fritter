import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import Intersection from '@dojo/widget-core/meta/Intersection';
import * as css from './post.m.css';
import { SubmitPostArguments, FavPostArguments } from '../interfaces';

interface PostProperties {
	message: string;
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
		const { id, message, lowQualityUrl, retry } = this.properties;
		retry({ id, message, imageUrl: lowQualityUrl });
	}

	protected render() {
		const { message, highQualityUrl, lowQualityUrl, favCount, hasFailed } = this.properties;
		const { isIntersecting } = this.meta(Intersection).get('root');
		const footer = this.meta(Intersection).get('footer');
		const src = isIntersecting || this._hasLoaded ? highQualityUrl : lowQualityUrl;
		const activeClass = (footer.isIntersecting || hasFailed) ? css.figCaptionActive : null

		if (isIntersecting && !this._hasLoaded) {
			this._hasLoaded = true;
		}

		return v('div', { key: 'root', classes: [ css.root ] }, [
			v('figure', { classes: [ css.container ] }, [
				v('div', { classes: [ css.foo, activeClass ] }, [
					v('img', { classes: [ css.image ], alt: message, src }),
				]),
				hasFailed
				? v('button', { classes: [ activeClass ], onclick: this._onRetryClick }, ['\u21BB'])
				: v('figcaption', { key: 'footer', classes: [ css.figCaption, activeClass ] }, [
					v('span', { key: 'header', classes: [ css.header ] }, [ message, hasFailed ? 'FAIL' : '' ]),
					v('span', { key: 'fav', onclick: this._onFavClick, classes: [ css.fav ] }, [
						v('span', { classes: [ css.star ] }, [ '\u2605' ]),
						v('span', { classes: [ css.count ] }, [ `${favCount}` ])
					])
				])
			])
		]);
	}
}

export default Post;
