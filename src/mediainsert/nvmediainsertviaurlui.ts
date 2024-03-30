/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import { Plugin } from 'ckeditor5/src/core.js';
import { ButtonView, CollapsibleView, DropdownButtonView, type FocusableView } from 'ckeditor5/src/ui.js';

import mediaIcon from '../../theme/icons/media.svg';

import NVMediaInsertUI from './nvmediainsertui.js';

import type ReplaceNVMediaSourceCommand from '../media/replacenvmediasourcecommand.js';
import type InsertNVMediaCommand from '../media/insertnvmediacommand.js';
import NVMediaInsertUrlView, { type NVMediaInsertUrlViewSubmitEvent, NVMediaInsertUrlViewCancelEvent } from './ui/nvmediainserturlview.js';

export default class NVMediaInsertViaUrlUI extends Plugin {
    private _mediaInsertUI!: NVMediaInsertUI;

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
            requiresForm: true,
            buttonViewCreator: isOnlyOne => this._createInsertUrlButton(isOnlyOne),
            formViewCreator: isOnlyOne => this._createInsertUrlView(isOnlyOne)
        });
    }

    /**
     * @inheritDoc
     */
    private _createInsertUrlView(isOnlyOne: boolean): FocusableView {
        const editor = this.editor;
        const locale = editor.locale;
        const t = locale.t;

        const replaceNVMediaSourceCommand: ReplaceNVMediaSourceCommand = editor.commands.get('replaceNVMediaSource')!;
        const insertNVMediaCommand: InsertNVMediaCommand = editor.commands.get('insertNVMedia')!;

        const mediaInsertUrlView = new NVMediaInsertUrlView(locale);
        const collapsibleView = isOnlyOne ? null : new CollapsibleView(locale, [mediaInsertUrlView]);

        mediaInsertUrlView.bind('isMediaSelected').to(this._mediaInsertUI);
        mediaInsertUrlView.bind('isEnabled').toMany([insertNVMediaCommand, replaceNVMediaSourceCommand], 'isEnabled', (...isEnabled) => (
            isEnabled.some(isCommandEnabled => isCommandEnabled)
        ));

        // Set initial value because integrations are created on first dropdown open.
        mediaInsertUrlView.mediaURLInputValue = replaceNVMediaSourceCommand.value || '';

        this._mediaInsertUI.dropdownView!.on('change:isOpen', () => {
            if (this._mediaInsertUI.dropdownView!.isOpen) {
                mediaInsertUrlView.mediaURLInputValue = replaceNVMediaSourceCommand.value || '';

                if (collapsibleView) {
                    collapsibleView.isCollapsed = true;
                }
            }
        }, { priority: 'low' });

        mediaInsertUrlView.on<NVMediaInsertUrlViewSubmitEvent>('submit', () => {
            if (replaceNVMediaSourceCommand.isEnabled) {
                editor.execute('replaceNVMediaSource', { source: mediaInsertUrlView.mediaURLInputValue });
            } else {
                editor.execute('insertNVMedia', { source: mediaInsertUrlView.mediaURLInputValue });
            }

            this._closePanel();
        });

        mediaInsertUrlView.on<NVMediaInsertUrlViewCancelEvent>('cancel', () => this._closePanel());

        if (collapsibleView) {
            collapsibleView.set({
                isCollapsed: true
            });

            collapsibleView.bind('label').to(this._mediaInsertUI, 'isMediaSelected', isMediaSelected => isMediaSelected ?
                t('Update media URL') :
                t('Insert media via URL')
            );

            return collapsibleView;
        }

        return mediaInsertUrlView;
    }

    /**
     * Nút chèn media
     */
    private _createInsertUrlButton(isOnlyOne: boolean): ButtonView {
        const ButtonClass = isOnlyOne ? DropdownButtonView : ButtonView;

        const editor = this.editor;
        const button = new ButtonClass(editor.locale);
        const t = editor.locale.t;

        button.set({
            icon: mediaIcon,
            tooltip: true
        });

        button.bind('label').to(this._mediaInsertUI, 'isMediaSelected', isMediaSelected => isMediaSelected ?
            t('Update media URL') :
            t('Insert media via URL')
        );

        return button;
    }

    /**
     * Closes the dropdown.
     */
    private _closePanel(): void {
        this.editor.editing.view.focus();
        this._mediaInsertUI.dropdownView!.isOpen = false;
    }
}
