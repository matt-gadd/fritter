import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import * as css from './header.m.css';
import { SubmitPostArguments, SelectImageArguments, CaptionInputArguments } from '../interfaces';

interface HeaderProperties {
	post(args: SubmitPostArguments): void;
	onSelectImage(args: SelectImageArguments): void;
	onCaptionInput(args: CaptionInputArguments): void;
	imageUrl?: string;
	caption?: string;
}

export class Header extends WidgetBase<HeaderProperties> {
	private _maxChars = 100;
	private _scrollToTop = false;

	private _onImageSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length) {
			this.properties.onSelectImage({ file: target.files[0] });
		}
	}

	private _onCaptionInput(event: Event) {
		const target = event.target as HTMLInputElement;
		this.properties.onCaptionInput({ caption: target.value });
	}

	protected render() {
		const { post, imageUrl, caption = '' } = this.properties;
		const isEnabled = imageUrl && caption;
		return [
			v('h1', { classes: [css.title], onclick: () => {
				this._scrollToTop = true;
				this.invalidate();
			}}, ['fritter.']),
			v('div', {
				classes: [css.root],
				scrollIntoView: () => {
					const shouldScroll = this._scrollToTop;
					this._scrollToTop = false;
					return shouldScroll;
				}
			}, [
				v('div', { classes: [css.inputWrapper] }, [
					v('div', { classes: [css.top] }, [
						v('label', { classes: [css.inputLabel] }, [
							v('span', { classes: [css.hidden] }, ['Caption']),
							v('textarea', {
								classes: [css.input],
								oninput: this._onCaptionInput,
								placeholder: 'Enter a caption',
								maxLength: this._maxChars,
								value: caption
							})
						]),
						imageUrl ? v('img', { classes: [css.image], src: imageUrl }) : null,
						v('span', { classes: [css.charCount] }, [
							`${caption.length}/${this._maxChars}`
						])
					]),
					v('div', { classes: [css.bottom] }, [
						v('label', { classes: [css.fileLabel] }, [
							'Add Image',
							v('input', {
								classes: [css.hidden],
								type: 'file',
								accept: 'image/*',
								onchange: this._onImageSelect
							})
						]),
						v('button', {
							disabled: !isEnabled,
							classes: [css.button],
							onclick: () => {
								imageUrl && post({ imageUrl, caption });
							}
						}, ['Post It!'])
					])
				])
			]
			)
		];
	}
}

export default Header;
