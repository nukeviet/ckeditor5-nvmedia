/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import type {
	DocumentSelection,
	Schema,
	Selection,
	ViewContainerElement,
	DowncastWriter,
} from 'ckeditor5/src/engine.js';
import { first } from 'ckeditor5/src/utils.js';

export function createMediaViewElement(writer: DowncastWriter, mediaType: 'NVMediaVideo' | 'NVMediaAudio'): ViewContainerElement {
	if (mediaType == 'NVMediaAudio') {
		return writer.createContainerElement('figure', { class: 'nv-media' }, [
			writer.createEmptyElement('audio', {controls: ''})
		]);
	}

	return writer.createContainerElement('figure', { class: 'nv-media' }, [
		writer.createEmptyElement('video', {controls: ''})
	]);
}
