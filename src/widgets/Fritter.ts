import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './fritter.m.css';

export class Fritter extends WidgetBase {
	protected render() {
		return v('div', { classes: css.root }, [
			v('div', { classes: css.label }, ['Fritter'])
		]);
	}
}

export default Fritter;
