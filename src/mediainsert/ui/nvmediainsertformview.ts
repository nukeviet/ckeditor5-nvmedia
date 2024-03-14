/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import {
    View,
    type FocusableView
} from 'ckeditor5/src/ui.js';
import { type Locale } from 'ckeditor5/src/utils.js';

export default class NVMediaInsertFormView extends View {
    constructor(locale: Locale, integrations: Array<FocusableView> = []) {
        super(locale);
    }
}
