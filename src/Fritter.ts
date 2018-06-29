import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import * as css from './fritter.m.css';
import HeaderContainer from './header/HeaderContainer';
import FeedContainer from './feed/FeedContainer';

export class Fritter extends WidgetBase {
	protected render() {
		return v('div', { classes: css.root }, [
			w(HeaderContainer, {}),
			w(FeedContainer, {})
		]);
	}
}

export default Fritter;
