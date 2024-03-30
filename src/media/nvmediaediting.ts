/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

/* globals window */

import { Plugin } from 'ckeditor5/src/core.js';
import { Notification } from 'ckeditor5/src/ui.js';
import InsertNVMediaCommand from './insertnvmediacommand.js';
import ReplaceNVMediaSourceCommand from './replacenvmediasourcecommand.js';
import NVMediaUtils from '../nvmediauntils.js';
import { createMediaViewElement, getMediaViewElementMatcher } from './utils.js';
import { downcastMediaAttribute, upcastMediaFigure } from './converters.js';

export default class NVMediaEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'NVMediaEditing' as const;
	}

	/**
	 * @inheritDoc
	 */
	public static get requires() {
		return [Notification] as const;
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		const editor = this.editor;
		const schema = editor.model.schema;

		schema.register('NVMediaVideo', {
			inheritAllFrom: '$blockObject',
			allowAttributes: [
				'autoplay', 'controls', 'controlslist', 'crossorigin',
				'disablepictureinpicture', 'disableremoteplayback', 'height', 'loop',
				'muted', 'playsinline', 'poster', 'preload', 'width', 'src'
			]
		});

		schema.register('NVMediaAudio', {
			inheritAllFrom: '$blockObject',
			allowAttributes: [
				'autoplay', 'controls', 'controlslist', 'crossorigin',
				'disableremoteplayback', 'loop', 'muted', 'preload', 'src'
			]
		});

		editor.commands.add('insertNVMedia', new InsertNVMediaCommand(editor));
		editor.commands.add('replaceNVMediaSource', new ReplaceNVMediaSourceCommand(editor));

		this._setupConversion();
	}

	/**
	 * Thiết lập bộ chuyển đổi
	 */
	private _setupConversion(): void {
		const editor = this.editor;
		const t = editor.t;
		const conversion = editor.conversion;
		const mediaUtils: NVMediaUtils = this.editor.plugins.get('NVMediaUtils');

		// Model => figure.nv-media
		conversion.for('dataDowncast')
			.elementToStructure({
				model: 'NVMediaVideo',
				view: (modelElement, { writer }) => createMediaViewElement(writer, 'NVMediaVideo')
			});

		// Model => figure.nv-media
		conversion.for('editingDowncast')
			.elementToStructure({
				model: 'NVMediaVideo',
				view: (modelElement, { writer }) => mediaUtils.toMediaWidget(
					createMediaViewElement(writer, 'NVMediaVideo'), writer, t('Media widget')
				)
			});

		conversion.for('downcast')
			.add(downcastMediaAttribute(mediaUtils, 'NVMediaVideo', 'src'));

		// figure.nv-media => model
		conversion.for('upcast')
			.elementToElement({
				view: getMediaViewElementMatcher(editor, 'NVMediaVideo'),
				model: (viewMedia, { writer }) => writer.createElement(
					'NVMediaVideo',
					viewMedia.hasAttribute('src') ? { src: viewMedia.getAttribute('src') } : undefined
				)
			})
			.add(upcastMediaFigure(mediaUtils, 'NVMediaVideo'));

		// Model => figure.nv-media
		conversion.for('dataDowncast')
			.elementToStructure({
				model: 'NVMediaAudio',
				view: (modelElement, { writer }) => createMediaViewElement(writer, 'NVMediaAudio')
			});

		// Model => figure.nv-media
		conversion.for('editingDowncast')
			.elementToStructure({
				model: 'NVMediaAudio',
				view: (modelElement, { writer }) => mediaUtils.toMediaWidget(
					createMediaViewElement(writer, 'NVMediaAudio'), writer, t('Media widget')
				)
			});

		conversion.for('downcast')
			.add(downcastMediaAttribute(mediaUtils, 'NVMediaAudio', 'src'));

		// figure.nv-media => model
		conversion.for('upcast')
			.elementToElement({
				view: getMediaViewElementMatcher(editor, 'NVMediaAudio'),
				model: (viewMedia, { writer }) => writer.createElement(
					'NVMediaAudio',
					viewMedia.hasAttribute('src') ? { src: viewMedia.getAttribute('src') } : undefined
				)
			})
			.add(upcastMediaFigure(mediaUtils, 'NVMediaAudio'));
	}
}
