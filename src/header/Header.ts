import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './header.m.css';

export class Header extends WidgetBase {
	protected render() {
		return v('div', { classes: css.root }, [
			v('div', { classes: css.label }, ['Header'])
		]);
	}
}

export default Header;
