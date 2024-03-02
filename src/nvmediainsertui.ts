/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import {
    Plugin,
    type Editor
} from 'ckeditor5/src/core.js';
import {
    createDropdown,
    SplitButtonView,
    ButtonView,
    type DropdownView,
    type DropdownButtonView,
    type FocusableView
} from 'ckeditor5/src/ui.js';
import mediaIcon from '../theme/icons/media.svg';
import {
    logWarning,
    type Observable,
    type Locale,
} from 'ckeditor5/src/utils.js';
import NVMediaUtils from './nvmediauntils.js';

import type NVMediaInsertCommand from './nvmediainsertcommand.js';

export default class NVMediaInsertUI extends Plugin {
    /**
     * @inheritDoc
     */
    public static get pluginName() {
        return 'NVMediaInsertUI' as const;
    }

    /**
     * @inheritDoc
     */
    public static get requires() {
        return [NVMediaUtils] as const;
    }

    /**
     * Các phương thức tích hợp nút chèn media
     */
    private _integrations = new Map<string, IntegrationData>();

    /**
     * Đối tượng đang chọn có phải video hoặc audio hay không
     */
    declare public isMediaSelected: boolean;

    /**
     * @inheritDoc
     */
    constructor(editor: Editor) {
        super(editor);

        // Upload thường nặng, do đó khó upload được ngay nên ưu tiên cái assetManager lên đầu
        editor.config.define('nvmedia.insert.integrations', [
            'assetManager',
            'upload',
            'url'
        ]);
    }

    /**
     * @inheritDoc
     */
    public init(): void {
        const editor = this.editor;
        const selection = editor.model.document.selection;
        const mediaUtils: NVMediaUtils = editor.plugins.get('NVMediaUtils');
        const componentFactory = editor.ui.componentFactory;
        const t = editor.t;

        this.set('isMediaSelected', false);

        this.listenTo(editor.model.document, 'change', () => {
            this.isMediaSelected = mediaUtils.isMedia(selection.getSelectedElement());
        });

        const componentCreator = (locale: Locale) => this._createToolbarComponent(locale);

        componentFactory.add('nvmediaInsert', componentCreator);
    }

    /**
     * Thiết lập nút chèn media: Tùy thuộc vào config mà có dropdown hay không.
     */
    private _createToolbarComponent(locale: Locale): DropdownView | FocusableView {
        const editor = this.editor;
        const t = locale.t;

        const integrations = this._prepareIntegrations();
        if (!integrations.length) {
            return null as any;
        }

        let dropdownButton: SplitButtonView | DropdownButtonView | undefined;
        const firstIntegration = integrations[0];

        if (integrations.length == 1) {
            // Trường hợp chỉ có 1 phương thức chèn media, hiển thị 1 nút và không có dropdown
            if (!firstIntegration.requiresForm) {
                return firstIntegration.buttonViewCreator(true);
            }

            dropdownButton = firstIntegration.buttonViewCreator(true) as DropdownButtonView;
        } else {
            // Trường hợp nhiều phương thức
            const actionButton = firstIntegration.buttonViewCreator(false) as ButtonView & FocusableView;

            dropdownButton = new SplitButtonView(locale, actionButton);
            dropdownButton.tooltip = true;

            dropdownButton.bind('label').to(this, 'isMediaSelected', isMediaSelected => isMediaSelected ?
                t('Replace media') :
                t('Insert media')
            );
        }

        const dropdownView = createDropdown(locale, dropdownButton);
        const observables = integrations.map(({ observable }) => observable);

        dropdownView.bind('isEnabled').toMany(observables, 'isEnabled', (...isEnabled) => (
            isEnabled.some(isEnabled => isEnabled)
        ));

        dropdownView.once('change:isOpen', () => {
            const integrationViews = integrations.map(({ formViewCreator }) => formViewCreator(integrations.length == 1));
            const mediaInsertFormView = new NVMediaInsertFormView(editor.locale, integrationViews);

            dropdownView.panelView.children.add(mediaInsertFormView);
        });

        return dropdownView;
    }

    /**
     * Lấy và kiểm tra các phương thức chèn media
     */
    private _prepareIntegrations(): Array<IntegrationData> {
        const editor = this.editor;
        const items = editor.config.get('nvmedia.insert.integrations')!;
        const result: Array<IntegrationData> = [];

        // Không có phương thức chèn nào thì trả về rỗng
        if (!items.length) {
            logWarning('nvmedia-insert-integrations-not-specified');
            return result;
        }

        for (const item of items) {
            if (!this._integrations.has(item)) {
                if (!['upload', 'assetManager', 'url'].includes(item)) {
                    logWarning('nvmedia-insert-unknown-integration', { item });
                }
                continue;
            }
            result.push(this._integrations.get(item)!);
        }

        // Không có phương thức tích hợp nào
        if (!result.length) {
            logWarning('nvmedia-insert-integrations-not-registered');
        }

        return result;
    }
}

type IntegrationData = {
    observable: Observable & { isEnabled: boolean };
    buttonViewCreator: (isOnlyOne: boolean) => ButtonView;
    formViewCreator: (isOnlyOne: boolean) => FocusableView;
    requiresForm: boolean;
};
