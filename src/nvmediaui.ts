/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Plugin } from 'ckeditor5/src/core.js';
import { ButtonView } from 'ckeditor5/src/ui.js';
import mediaIcon from '../theme/icons/media.svg';

import type NVMediaCommand from './nvmediacommand.js';

export default class NVMediaUI extends Plugin {
    /**
     * @inheritDoc
     */
    public static get pluginName() {
        return 'NVMediaUI' as const;
    }

    /**
     * @inheritDoc
     */
    public init(): void {
        const editor = this.editor;
        const componentFactory = editor.ui.componentFactory;
        const t = editor.t;

        componentFactory.add('nvmedia', locale => {
            const command: NVMediaCommand = editor.commands.get('nvmedia')!;

            const button = new ButtonView(locale);

            button.set({
                label: t('Insert file from NVFileManager'),
                icon: mediaIcon,
                tooltip: true
            });

            button.bind('isEnabled').to(command);

            button.on('execute', () => {
                editor.execute('nvmedia');
                editor.editing.view.focus();
            });

            return button;
        });
    }
}
