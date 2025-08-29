/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import type {
	MatcherPattern,
	ViewContainerElement,
	ViewDowncastWriter,
	ViewElement
} from 'ckeditor5';
import type { Editor } from 'ckeditor5';
import { first } from 'ckeditor5';
import NVMediaUtils from '../nvmediauntils.js';

export function createMediaViewElement(writer: ViewDowncastWriter, mediaType: 'NVMediaVideo' | 'NVMediaAudio'): ViewContainerElement {
	if (mediaType == 'NVMediaAudio') {
		return writer.createContainerElement('figure', { class: 'nv-media' }, [
			writer.createEmptyElement('audio', { controls: '' })
		]);
	}

	return writer.createContainerElement('figure', { class: 'nv-media' }, [
		writer.createEmptyElement('video', { controls: '' })
	]);
}

/**
 */
export function getMediaViewElementMatcher(editor: Editor, matchMediaType: 'NVMediaVideo' | 'NVMediaAudio'): MatcherPattern {
	const mediaUtils: NVMediaUtils = editor.plugins.get('NVMediaUtils');

	return element => {
		// Không phải thẻ audio và match audio thì loại
		if (!mediaUtils.isMediaView('audio', element) && matchMediaType == 'NVMediaAudio') {
			return null;
		}
		// Không phải thẻ video và match video thì loại
		if (!mediaUtils.isMediaView('video', element) && matchMediaType == 'NVMediaVideo') {
			return null;
		}
		// Thẻ cha của nó không phải figure.nv-media thì loại
		if (!element.findAncestor(mediaUtils.isBlockMediaView)) {
			return null;
		}

		return getPositiveMatchPattern(element);
	};

	function getPositiveMatchPattern(element: ViewElement) {
		const pattern: Record<string, unknown> = {
			name: true
		};

		if (element.hasAttribute('src')) {
			pattern.attributes = ['src'];
		}

		return pattern;
	}
}
