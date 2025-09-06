/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Plugin, MenuBarMenuListItemButtonView } from 'ckeditor5';
import { ButtonView } from 'ckeditor5';

import mediaIcon from '../../theme/icons/media.svg';

import NVMediaInsertUI from './nvmediainsertui.js';

import type ReplaceNVMediaSourceCommand from '../media/replacenvmediasourcecommand.js';
import type InsertNVMediaCommand from '../media/insertnvmediacommand.js';
import NVMediaInsertUrlView from './ui/nvmediainserturlview.js';

export default class NVMediaInsertViaUrlUI extends Plugin {
    private _mediaInsertUI!: NVMediaInsertUI;
    private _formView?: NVMediaInsertUrlView;

    /**
     * @inheritDoc
     */
    public static get pluginName() {
        return 'NVMediaInsertViaUrlUI' as const;
    }

    /**
     * @inheritDoc
     */
    public static get requires() {
        return [NVMediaInsertUI] as const;
    }

    /**
     * @inheritDoc
     */
    public afterInit(): void {
        this._mediaInsertUI = this.editor.plugins.get('NVMediaInsertUI');
        this._mediaInsertUI.registerIntegration({
            name: 'url',
            observable: () => this.editor.commands.get('insertNVMedia')!,
            buttonViewCreator: () => this._createToolbarButton(),
            formViewCreator: () => this._createDropdownButton(),
        });
    }

    /**
     * @inheritDoc
     */
    private _createInsertUrlView(): NVMediaInsertUrlView {
        const editor = this.editor;
        const locale = editor.locale;

        const replaceNVMediaSourceCommand: ReplaceNVMediaSourceCommand = editor.commands.get('replaceNVMediaSource')!;
        const insertNVMediaCommand: InsertNVMediaCommand = editor.commands.get('insertNVMedia')!;

        const mediaInsertUrlView = new NVMediaInsertUrlView(locale);

        mediaInsertUrlView.bind('isMediaSelected').to(this._mediaInsertUI);
        mediaInsertUrlView.bind('isEnabled').toMany([insertNVMediaCommand, replaceNVMediaSourceCommand], 'isEnabled', (...isEnabled) => (
            isEnabled.some(isCommandEnabled => isCommandEnabled)
        ));

        return mediaInsertUrlView;
    }

    /**
     * Hiển thị Dialog chèn media qua URL
     */
    private _showModal() {
        const editor = this.editor;
        const locale = editor.locale;
        const t = locale.t;
        const dialog = editor.plugins.get('Dialog');

        if (!this._formView) {
            this._formView = this._createInsertUrlView();
            this._formView.on('submit', () => this._handleSave());
        }

        const replaceNVMediaSourceCommand = editor.commands.get('replaceNVMediaSource')!;
        this._formView.mediaURLInputValue = replaceNVMediaSourceCommand.value || '';

        dialog.show({
            id: 'insertNVMediaViaUrl',
            title: t('Media via URL'),
            isModal: true,
            content: this._formView,
            actionButtons: [
                {
                    label: t('Cancel'),
                    withText: true,
                    onExecute: () => dialog.hide()
                },
                {
                    label: this._mediaInsertUI.isMediaSelected ? t('Save') : t('Insert'),
                    class: 'ck-button-action',
                    withText: true,
                    onExecute: () => this._handleSave()
                }
            ]
        });
    }

    /**
	 * Tạo nút chèn media, loại nút tùy thuộc vị trí chèn: Chèn vào toolbar hay menu bar
	 */
    private _createInsertUrlButton<T extends typeof ButtonView | typeof MenuBarMenuListItemButtonView>(
        ButtonClass: T
    ): InstanceType<T> {
        const button = new ButtonClass(this.editor.locale) as InstanceType<T>;

        button.icon = mediaIcon;
        button.on('execute', () => {
            this._showModal();
        });

        return button;
    }

    /**
     * Creates the toolbar button for inserting media via URL: icon and tooltip.
     *
     * @returns ButtonView
     */
    private _createToolbarButton(): ButtonView {
        const t = this.editor.locale.t;
        const button = this._createInsertUrlButton(ButtonView);

        button.tooltip = true;
        button.bind('label').to(
            this._mediaInsertUI,
            'isMediaSelected',
            isMediaSelected => isMediaSelected ? t('Update media URL') : t('Insert media via URL')
        );

        return button;
    }

    /**
     * @returns ButtonView
     */
    private _createDropdownButton(): ButtonView {
        const t = this.editor.locale.t;
        const button = this._createInsertUrlButton(ButtonView);

        button.withText = true;
        button.bind('label').to(
            this._mediaInsertUI,
            'isMediaSelected',
            isMediaSelected => isMediaSelected ? t('Update media URL') : t('Insert via URL')
        );

        return button;
    }

    /**
     * Xử lý khi ấn nút Lưu trong Dialog chèn media qua URL
     */
    private _handleSave() {
        const replaceNVMediaSourceCommand = this.editor.commands.get('replaceNVMediaSource')!;

        if (replaceNVMediaSourceCommand.isEnabled) {
            this.editor.execute('replaceNVMediaSource', { source: this._formView!.mediaURLInputValue });
        } else {
            this.editor.execute('insertNVMedia', { source: this._formView!.mediaURLInputValue });
        }

        this.editor.plugins.get('Dialog').hide();
    }
}
