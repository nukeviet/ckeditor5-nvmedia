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
	ModelElement,
	UpcastDispatcher,
	UpcastElementEvent,
	DowncastAttributeEvent
} from 'ckeditor5/src/engine.js';
import { first, type GetCallback } from 'ckeditor5/src/utils.js';
import type NVMediaUtils from '../nvmediauntils.js';

/**
 *
 */
export function downcastMediaAttribute(
	mediaUtils: NVMediaUtils,
	mediaType: 'NVMediaVideo' | 'NVMediaAudio',
	attributeKey: string
): (dispatcher: DowncastDispatcher) => void {
	const converter: GetCallback<DowncastAttributeEvent<ModelElement>> = (evt, data, conversionApi) => {
		if (!conversionApi.consumable.consume(data.item, evt.name)) {
			return;
		}

		const viewWriter = conversionApi.writer;
		const element = conversionApi.mapper.toViewElement(data.item)!;
		const media = mediaUtils.findViewMediaElement(element, mediaType)!;

		viewWriter.setAttribute(data.attributeKey, data.attributeNewValue || '', media);
	};

	return dispatcher => {
		dispatcher.on<DowncastAttributeEvent<ModelElement>>(`attribute:${attributeKey}:${mediaType}`, converter);
	};
}

/**
 *
 */
export function upcastMediaFigure(mediaUtils: NVMediaUtils, mediaType: 'NVMediaVideo' | 'NVMediaAudio'): (dispatcher: UpcastDispatcher) => void {
	const converter: GetCallback<UpcastElementEvent> = (evt, data, conversionApi) => {
		// Không chuyển đổi nếu thẻ không phải là figure.nv-media
		if (!conversionApi.consumable.test(data.viewItem, { name: true, classes: 'nv-media' })) {
			return;
		}

		// Tìm thẻ video hoặc audio trong figure
		const viewMedia = mediaUtils.findViewMediaElement(data.viewItem, mediaType);

		// Không chuyển đổi nếu không tìm thấy thẻ video, audio hoặc nó đã chuyển đổi
		if (!viewMedia || !conversionApi.consumable.test(viewMedia, { name: true })) {
			return;
		}

		// Consume the figure to prevent other converters from processing it again.
		conversionApi.consumable.consume(data.viewItem, { name: true, classes: 'nv-media' });

		// Convert view media to model.
		const conversionResult = conversionApi.convertItem(viewMedia, data.modelCursor);

		// Lấy model được chuyển đổi
		const modelMedia = first(conversionResult.modelRange!.getItems()) as ModelElement;

		// Chuyển không thành công thì dừng
		if (!modelMedia) {
			conversionApi.consumable.revert(data.viewItem, { name: true, classes: 'nv-media' });
			return;
		}

		conversionApi.convertChildren(data.viewItem, modelMedia);
		conversionApi.updateConversionResult(modelMedia, data);
	};

	return dispatcher => {
		dispatcher.on<UpcastElementEvent>('element:figure', converter);
	};
}
