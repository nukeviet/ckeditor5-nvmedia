/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Plugin } from 'ckeditor5/src/core.js';
import NVMediaInsertViaUrl from './nvmediainsertviaurl.js';
import NVMediaInsertUI from './mediainsert/nvmediainsertui.js';

export default class NVMediaInsert extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'NVMediaInsert' as const;
    }

    /**
     * @inheritDoc
     */
    static get requires() {
        return [NVMediaInsertViaUrl, NVMediaInsertUI] as const;
    }
}
