/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import type {
    Element
} from 'ckeditor5/src/engine.js';
import { Plugin } from 'ckeditor5/src/core.js';

export default class NVMediaUtils extends Plugin {
    /**
     * @inheritDoc
     */
    public static get pluginName() {
        return 'NVMediaUtils' as const;
    }

    public isMedia(modelElement?: Element | null): modelElement is Element & { name: 'video' | 'audio' } {
        // FIXME
        console.log(modelElement);
        return !!modelElement && (modelElement.is('element', 'video') || modelElement.is('element', 'audio'));
    }
}
