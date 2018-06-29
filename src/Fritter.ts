import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import * as css from './fritter.m.css';
import Header from './header/Header';
import Feed from './feed/Feed';

export class Fritter extends WidgetBase {
	protected render() {
		return v('div', { classes: css.root }, [
			v('div', { classes: css.label }, ['Fritter']),
			w(Header, {}),
			w(Feed, {})
		]);
	}
}

export default Fritter;
