import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './header.m.css';

interface HeaderProperties {
	post(args: { message: string }): void;
}

export class Header extends WidgetBase<HeaderProperties> {

	private _message = '';

	protected render() {
		const { post } = this.properties;
		return v('div', { classes: css.root }, [
			v('h1', { classes: css.label }, ['fritter.']),
			v('div', { classes: css.inputWrapper }, [
				v('textarea', {
					classes: css.input,
					oninput: (e: Event) => {
						this._message = (e.target as HTMLInputElement).value;
						this.invalidate();
					},
					placeholder: 'Enter a message',
					value: this._message
				}),
				v('button', {
					classes: css.button,
					onclick: () => {
						post({ message: this._message });
						this._message = '';
						this.invalidate();
					}
				}, [ 'post' ])
			])
		]);
	}
}

export default Header;
