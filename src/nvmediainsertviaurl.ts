/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Plugin } from 'ckeditor5/src/core.js';
import NVMediaInsertUI from './mediainsert/nvmediainsertui.js';
import NVMediaInsertViaUrlUI from './mediainsert/nvmediainsertviaurlui.js';

export default class NVMediaInsertViaUrl extends Plugin {
    /**
     * @inheritDoc
     */
    public static get pluginName() {
        return 'NVMediaInsertViaUrl' as const;
    }

    /**
     * @inheritDoc
     */
    public static get requires() {
        return [NVMediaInsertViaUrlUI, NVMediaInsertUI] as const;
    }
}
