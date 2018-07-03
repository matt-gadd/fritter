import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './header.m.css';

interface HeaderProperties {
	post(args: { file: File, message: string }): void;
	onSelectImage(args: { file: File }): void;
	onMessageInput(args: { message: string }): void;
	imageUrl?: string;
	message?: string;
}

export class Header extends WidgetBase<HeaderProperties> {

	private _file: File;

	private _onImageSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length) {
			this._file = target.files[0];
			this.properties.onSelectImage({ file: target.files[0] });
		}
	}

	private _onMessageInput(event: Event) {
		const target = event.target as HTMLInputElement;
		this.properties.onMessageInput({ message: target.value });
	}

	protected render() {
		const { post, imageUrl, message = '' } = this.properties;
		return v('div', { classes: css.root }, [
			v('h1', { classes: css.label }, ['fritter.']),
			v('div', { classes: css.inputWrapper }, [
				v('input', { type: 'file', accept: 'image/*', onchange: this._onImageSelect }),
				imageUrl ? v('img', { classes: css.image, src: imageUrl }) : null,
				v('textarea', {
					classes: css.input,
					oninput: this._onMessageInput,
					placeholder: 'Enter a message',
					value: message
				}),
				v('button', {
					classes: css.button,
					onclick: () => {
						post({ file: this._file, message });
					}
				}, ['post'])
			])
		]);
	}
}

export default Header;
