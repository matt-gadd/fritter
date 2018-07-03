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
	private _showImage = true;

	private _onClick() {
		this._showImage = !this._showImage;
		this.invalidate();
	}

	protected render() {
		const { message, high_quality_url, low_quality_url} = this.properties;
		const { isIntersecting } = this.meta(Intersection).get('root');

		const src = isIntersecting || this._hasLoaded ? high_quality_url : low_quality_url;

		if (isIntersecting && !this._hasLoaded) {
			this._hasLoaded = true;
		}

		if (!isIntersecting) {
			this._showImage = true;
		}

		return v('div', { key: 'root', classes: css.root, onclick: this._onClick }, [
			this._showImage ? v('img', { classes: css.image, src }) : v('div', { classes: css.label }, [ message ])
		]);
	}
}

export default Post;
