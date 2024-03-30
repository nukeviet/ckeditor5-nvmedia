/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Command, type Editor } from 'ckeditor5/src/core.js';
import { toArray, type ArrayOrItem } from 'ckeditor5/src/utils.js';
import NVMediaUtils from '../nvmediauntils.js';

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
        const mediaUtils: NVMediaUtils = this.editor.plugins.get('NVMediaUtils');

        this.isEnabled = mediaUtils.isMediaAllowed();
    }

    /**
	 * Thực thi lệnh chèn media.
	 */
    public override execute(options: { source: ArrayOrItem<string | Record<string, unknown>> }): void {
        const sourceDefinitions = toArray<string | Record<string, unknown>>(options.source);
        const selection = this.editor.model.document.selection;
        const mediaUtils: NVMediaUtils = this.editor.plugins.get('NVMediaUtils');
        const selectionAttributes = Object.fromEntries(selection.getAttributes());

        sourceDefinitions.forEach((sourceDefinition, index) => {
            const selectedElement = selection.getSelectedElement();

            if (typeof sourceDefinition === 'string') {
                sourceDefinition = { src: sourceDefinition };
            }

            if (index && selectedElement && mediaUtils.isMedia(selectedElement)) {
                const position = this.editor.model.createPositionAfter(selectedElement);

                mediaUtils.insertMedia({ ...sourceDefinition, ...selectionAttributes }, position);
            } else {
                mediaUtils.insertMedia({ ...sourceDefinition, ...selectionAttributes });
            }
        });
    }
}
