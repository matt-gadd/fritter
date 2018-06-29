import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './post.m.css';

interface PostProperties {
	message: string;
}

export class Post extends WidgetBase<PostProperties> {
	protected render() {
		const { message } = this.properties;
		return v('div', { classes: css.root }, [
			v('div', { classes: css.label }, [ message ])
		]);
	}
}

export default Post;
