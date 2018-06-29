import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './post.m.css';

export class Post extends WidgetBase {
	protected render() {
		return v('div', { classes: css.root }, [
			v('div', { classes: css.label }, ['Post'])
		]);
	}
}

export default Post;
