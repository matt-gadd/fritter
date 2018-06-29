import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import * as css from './feed.m.css';
import Post from '../post/Post';

export class Feed extends WidgetBase {
	protected render() {
		return v('div', { classes: css.root }, [
			v('div', { classes: css.label }, ['Feed']),
			w(Post, {})
		]);
	}
}

export default Feed;
