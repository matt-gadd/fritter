import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';

import * as css from './placeholderPost.m.css';

export default class PlaceholderPost extends WidgetBase {
	protected render() {
		return v('div', { classes: [ css.root ] });
	}
}
