/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

/**
 * @module nvmedia/nvmediaconfig
 */

/**
 * ```
 * ClassicEditor
 * 	.create( editorElement, {
 * 		nvmedia: {
 * 			options: {
 * 			},
 *          browseUrl: '',
 * 		}
 * 	} )
 * 	.then( ... )
 * 	.catch( ... );
 * ```
 */
export interface NVMediaConfig {
    /*
     *
     */
    browseUrl?: string;

    /*
     *
     */
    options?: NVMediaOptions;

    insert?: NVMediaInsertConfig;
}

export interface NVMediaOptions extends Record<string, unknown> {
	noCache?: boolean;
}

export interface NVMediaInsertConfig {
    integrations?: Array<string>;
}
