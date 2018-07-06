import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import Intersection from '@dojo/widget-core/meta/Intersection';
import * as css from './post.m.css';

interface PostProperties {
	message: string;
	highQualityUrl: string;
	lowQualityUrl: string;
	favCount: number;
}

export class Post extends WidgetBase<PostProperties> {
	private _hasLoaded = false;

	protected render() {
		const { message, highQualityUrl, lowQualityUrl, favCount } = this.properties;
		const { isIntersecting } = this.meta(Intersection).get('root');
		const footer = this.meta(Intersection).get('footer');

		const src = isIntersecting || this._hasLoaded ? highQualityUrl : lowQualityUrl;

		if (isIntersecting && !this._hasLoaded) {
			this._hasLoaded = true;
		}

		return v('div', { key: 'root', classes: css.root }, [
			v('figure', { classes: css.container }, [
				v('div', { classes: [ css.foo, footer.isIntersecting ? css.fooActive : null ] }, [
					v('img', { classes: [ css.image ], alt: message, src }),
				]),
				v('figcaption', { key: 'footer', classes: [ css.figCaption, footer.isIntersecting ? css.figCaptionActive : null ] }, [
					v('span', { classes: [ css.header ] }, [ message ]),
					v('span', { classes: [ css.count ] }, [ `${favCount}` ])
				])
			])
		]);
	}
}

export default Post;
