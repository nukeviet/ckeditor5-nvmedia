/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Plugin } from 'ckeditor5';
import NVMediaEditing from './media/nvmediaediting.js';
import NVMediaInsertUI from './mediainsert/nvmediainsertui.js';

import '../theme/nvmedia.css';

export default class NVMedia extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'NVMedia' as const;
    }

    /**
     * @inheritDoc
     */
    static get requires() {
        return [NVMediaEditing, NVMediaInsertUI] as const;
    }
}
