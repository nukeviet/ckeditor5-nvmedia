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
    ViewCollection,
    submitHandler,
    FocusCycler,
    CollapsibleView,
    type FocusCyclerForwardCycleEvent,
    type FocusCyclerBackwardCycleEvent,
    type FocusableView
} from 'ckeditor5/src/ui.js';
import { FocusTracker, KeystrokeHandler, type Locale } from 'ckeditor5/src/utils.js';

/**
 * Xử lý hiển thị khi mở dropdown nút chèn media
 */
export default class NVMediaInsertFormView extends View {
    /**
     * Tracks information about DOM focus in the form.
     */
    public readonly focusTracker: FocusTracker;

    /**
     * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
     */
    public readonly keystrokes: KeystrokeHandler;

    /**
     * A collection of views that can be focused in the form.
     */
    protected readonly _focusables: ViewCollection<FocusableView>;

    /**
     * Helps cycling over {@link #_focusables} in the form.
     */
    protected readonly _focusCycler: FocusCycler;

    /**
     * A collection of the defined integrations for inserting the images.
     */
    private readonly children: ViewCollection<FocusableView>;

    constructor(locale: Locale, integrations: Array<FocusableView> = []) {
        super(locale);

        this.focusTracker = new FocusTracker();
        this.keystrokes = new KeystrokeHandler();
        this._focusables = new ViewCollection();
        this.children = this.createCollection();

        this._focusCycler = new FocusCycler({
            focusables: this._focusables,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                // Navigate form fields backwards using the Shift + Tab keystroke.
                focusPrevious: 'shift + tab',

                // Navigate form fields forwards using the Tab key.
                focusNext: 'tab'
            }
        });

        for (const view of integrations) {
            this.children.add(view);
            this._focusables.add(view);

            if (view instanceof CollapsibleView) {
                this._focusables.addMany(view.children);
            }
        }

        if (this._focusables.length > 1) {
            for (const view of this._focusables) {
                if (isViewWithFocusCycler(view)) {
                    view.focusCycler.on<FocusCyclerForwardCycleEvent>('forwardCycle', evt => {
                        this._focusCycler.focusNext();
                        evt.stop();
                    });

                    view.focusCycler.on<FocusCyclerBackwardCycleEvent>('backwardCycle', evt => {
                        this._focusCycler.focusPrevious();
                        evt.stop();
                    });
                }
            }
        }

        this.setTemplate({
            tag: 'form',

            attributes: {
                class: [
                    'ck',
                    'ck-image-insert-form'
                ],
                tabindex: -1
            },

            children: this.children
        });
    }

    /**
     * @inheritDoc
     */
    public override render(): void {
        super.render();

        submitHandler({
            view: this
        });

        for (const view of this._focusables) {
            this.focusTracker.add(view.element!);
        }

        // Start listening for the keystrokes coming from #element.
        this.keystrokes.listenTo(this.element!);

        const stopPropagation = (data: KeyboardEvent) => data.stopPropagation();

        // Since the form is in the dropdown panel which is a child of the toolbar, the toolbar's
        // keystroke handler would take over the key management in the URL input. We need to prevent
        // this ASAP. Otherwise, the basic caret movement using the arrow keys will be impossible.
        this.keystrokes.set('arrowright', stopPropagation);
        this.keystrokes.set('arrowleft', stopPropagation);
        this.keystrokes.set('arrowup', stopPropagation);
        this.keystrokes.set('arrowdown', stopPropagation);
    }

    /**
     * @inheritDoc
     */
    public override destroy(): void {
        super.destroy();

        this.focusTracker.destroy();
        this.keystrokes.destroy();
    }

    /**
     * Focuses the first {@link #_focusables focusable} in the form.
     */
    public focus(): void {
        this._focusCycler.focusFirst();
    }
}

function isViewWithFocusCycler(view: View): view is View & { focusCycler: FocusCycler } {
    return 'focusCycler' in view;
}
