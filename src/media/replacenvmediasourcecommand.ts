/**
 * NukeViet NVMedia for CKEditor5
 * @version 5.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2026 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import {
	Command,
	type Editor,
	type ModelWriter,
	type ModelElement
} from 'ckeditor5';
import type NVMediaUtils from '../nvmediauntils.js';

/**
 * Lệnh thay src của video, audio thành src khác.
 *
 * ```ts
 * editor.execute( 'replaceNVMediaSource', { source: 'http://url.to.the/media' } );
 * ```
 */
export default class ReplaceNVMediaSourceCommand extends Command {
	declare public value: string | null;

	constructor( editor: Editor ) {
		super( editor );

		this.decorate( 'cleanupMedia' );
	}

	/**
     * @inheritDoc
     */
	public override refresh(): void {
		const editor = this.editor;
		const mediaUtils: NVMediaUtils = editor.plugins.get( 'NVMediaUtils' );
		const element = this.editor.model.document.selection.getSelectedElement()!;

		this.isEnabled = mediaUtils.isMedia( element );
		this.value = this.isEnabled ? element.getAttribute( 'src' ) as string : null;
	}

	/**
     * Executes the command.
     *
     * @fires execute
     * @param options Options for the executed command.
     * @param options.source The media source to replace.
     */
	public override execute( options: { source: string } ): void {
		const media = this.editor.model.document.selection.getSelectedElement()!;

		this.editor.model.change( writer => {
			writer.setAttribute( 'src', options.source, media );
			this.cleanupMedia( writer, media );
		} );
	}

	// Giữ chữ ký cho tính năng tương lai (thân hàm hiện để trống).
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public cleanupMedia( writer: ModelWriter, media: ModelElement ): void {
		// writer.removeAttribute('srcset', media);
		// writer.removeAttribute('sizes', media);
		// writer.removeAttribute('sources', media);
		// writer.removeAttribute('width', media);
		// writer.removeAttribute('height', media);
		// writer.removeAttribute('alt', media);
		// Not thing, future features
	}
}
