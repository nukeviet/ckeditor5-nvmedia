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
    createDropdown,
    SplitButtonView,
    ButtonView,
    logWarning,
    type Editor,
    type DropdownView,
    type DropdownButtonView,
    type FocusableView,
    type Observable,
    type Locale
} from 'ckeditor5';

import NVMediaInsertFormView from './ui/nvmediainsertformview.js';
import NVMediaUtils from '../nvmediauntils.js';

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
     *
     */
    public dropdownView?: DropdownView;

    /**
     * Đối tượng đang chọn có phải video hoặc audio hay không
     */
    declare public isMediaSelected: boolean;

    /**
     * Các phương thức tích hợp nút chèn media
     */
    private _integrations = new Map<string, IntegrationData>();

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

        this.set('isMediaSelected', false);

        this.listenTo(editor.model.document, 'change', () => {
            this.isMediaSelected = mediaUtils.isMedia(selection.getSelectedElement());
        });

        const componentCreator = (locale: Locale) => this._createToolbarComponent(locale);

        editor.ui.componentFactory.add('nvmediaInsert', componentCreator);
        editor.ui.componentFactory.add('insertNVMedia', componentCreator);
    }

    /**
    * Đăng kí các tích hợp
    */
    public registerIntegration({
        name,
        observable,
        buttonViewCreator,
        formViewCreator,
        requiresForm
    }: {
        name: string;
        observable: Observable & { isEnabled: boolean } | (() => Observable & { isEnabled: boolean });
        buttonViewCreator: (isOnlyOne: boolean) => ButtonView;
        formViewCreator: (isOnlyOne: boolean) => FocusableView;
        requiresForm?: boolean;
    }): void {
        // Check trùng
        if (this._integrations.has(name)) {
            logWarning('nvmedia-insert-integration-exists', { name });
        }

        this._integrations.set(name, {
            observable,
            buttonViewCreator,
            formViewCreator,
            requiresForm: !!requiresForm
        });
    }

    /**
     * Thiết lập nút chèn media: Tùy thuộc vào config mà có dropdown hay không.
     */
    private _createToolbarComponent(locale: Locale): DropdownView | FocusableView {
        const editor = this.editor;
        const t = locale.t;

        // Lấy phương thức chèn media đã tích hợp không có thì dừng
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

        const dropdownView = this.dropdownView = createDropdown(locale, dropdownButton);
        const observables = integrations.map(({ observable }) => typeof observable == 'function' ? observable() : observable);

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
    observable: Observable & { isEnabled: boolean } | (() => Observable & { isEnabled: boolean });
    buttonViewCreator: (isOnlyOne: boolean) => ButtonView;
    formViewCreator: (isOnlyOne: boolean) => FocusableView;
    requiresForm: boolean;
};
