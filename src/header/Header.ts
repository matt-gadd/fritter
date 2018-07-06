import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './header.m.css';
import { SubmitPostArguments, SelectImageArguments, MessageInputArguments } from '../interfaces';

interface HeaderProperties {
	post(args: SubmitPostArguments): void;
	onSelectImage(args: SelectImageArguments): void;
	onMessageInput(args: MessageInputArguments): void;
	imageUrl?: string;
	message?: string;
}

export class Header extends WidgetBase<HeaderProperties> {

	private _file: File;
	private _maxChars = 100;

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
		const isEnabled = imageUrl && message;
		return v('div', { classes: css.root }, [
			v('div', { classes: css.inputWrapper }, [
				v('label', [
					v('span', [ 'Message' ]),
					v('textarea', {
						classes: css.input,
						oninput: this._onMessageInput,
						placeholder: 'Enter a message',
						maxLength: this._maxChars,
						value: message
					})
				]),
				imageUrl ? v('img', { classes: css.image, src: imageUrl }) : null,
				v('span', [ `${message.length}/${this._maxChars}` ]),
				v('div', [
					v('label', { classes: css.fileLabel }, [
						'+',
						v('input', { classes: css.file, type: 'file', accept: 'image/*', onchange: this._onImageSelect }),
					]),
					v('button', {
						disabled: !isEnabled,
						classes: css.button,
						onclick: () => {
							post({ file: this._file, message });
						}
					}, ['Send'])
				])
			])
		]);
	}
}

export default Header;
