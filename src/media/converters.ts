/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import type {
	DowncastDispatcher,
	Element,
	DowncastAttributeEvent
} from 'ckeditor5/src/engine.js';
import { type GetCallback } from 'ckeditor5/src/utils.js';
import type NVMediaUtils from '../nvmediauntils.js';

/**
 *
 */
export function downcastMediaAttribute(
	mediaUtils: NVMediaUtils,
	mediaType: 'NVMediaVideo' | 'NVMediaAudio',
	attributeKey: string
): (dispatcher: DowncastDispatcher) => void {
	const converter: GetCallback<DowncastAttributeEvent<Element>> = (evt, data, conversionApi) => {
		if (!conversionApi.consumable.consume(data.item, evt.name)) {
			return;
		}

		const viewWriter = conversionApi.writer;
		const element = conversionApi.mapper.toViewElement(data.item)!;
		const media = mediaUtils.findViewMediaElement(element, mediaType)!;

		viewWriter.setAttribute(data.attributeKey, data.attributeNewValue || '', media);
	};

	return dispatcher => {
		dispatcher.on<DowncastAttributeEvent<Element>>(`attribute:${attributeKey}:${mediaType}`, converter);
	};
}

