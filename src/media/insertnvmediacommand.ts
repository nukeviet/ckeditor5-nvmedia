/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Command, type Editor } from 'ckeditor5/src/core.js';
import { type ArrayOrItem } from 'ckeditor5/src/utils.js';

export default class InsertNVMediaCommand extends Command {
    /**
     * @inheritDoc
     */
    constructor(editor: Editor) {
        super(editor);
    }

    /**
	 * @inheritDoc
	 */
	public override refresh(): void {
        // FIXME
        this.isEnabled = true;
    }

    public override execute( options: { source: ArrayOrItem<string | Record<string, unknown>> } ): void {
        // FIXME
        console.log('execute InsertNVMediaCommand');
    }
}
