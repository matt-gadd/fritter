import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import Intersection from '@dojo/widget-core/meta/Intersection';
import * as css from './post.m.css';

interface PostProperties {
	message: string;
	high_quality_url?: string;
	low_quality_url?: string;
}

export class Post extends WidgetBase<PostProperties> {
	private _hasLoaded = false;

	protected render() {
		const { message, high_quality_url, low_quality_url} = this.properties;
		const { isIntersecting } = this.meta(Intersection).get('root');
		const footer = this.meta(Intersection).get('footer');

		const src = isIntersecting || this._hasLoaded ? high_quality_url : low_quality_url;

		if (isIntersecting && !this._hasLoaded) {
			this._hasLoaded = true;
		}

		return v('div', { key: 'root', classes: css.root }, [
			v('figure', { classes: css.container }, [
				v('div', { classes: [ css.foo, footer.isIntersecting ? css.fooActive : null ] }, [
					v('img', { classes: [ css.image ], alt: message, src }),
				]),
				v('figcaption', { key: 'footer', classes: [ css.figCaption, footer.isIntersecting ? css.figCaptionActive : null ] }, [
					v('span', { classes: [ css.header ] }, [ message ])
				])
			])
		]);
	}
}

export default Post;
