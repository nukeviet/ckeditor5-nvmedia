/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

import type {
	NVMedia,
	NVMediaUtils,
	NVMediaInsertCommand,
	NVMediaInsertViaUrl,
	NVMediaConfig,
	NVMediaEditing,
	NVMediaInsertUI,
	ReplaceNVMediaSourceCommand,
	InsertNVMediaCommand,
} from './index.js';

declare module '@ckeditor/ckeditor5-core' {
	interface EditorConfig {
		/**
		 *
		 */
		nvmedia?: NVMediaConfig;
	}

	interface PluginsMap {
		[NVMedia.pluginName]: NVMedia;
		[NVMediaUtils.pluginName]: NVMediaUtils;
		[NVMediaInsertUI.pluginName]: NVMediaInsertUI;
		[NVMediaInsertViaUrl.pluginName]: NVMediaInsertViaUrl;
		[NVMediaEditing.pluginName]: NVMediaEditing;
	}

	interface CommandsMap {
		nvmedia: NVMediaInsertCommand;
		replaceNVMediaSource: ReplaceNVMediaSourceCommand;
		insertNVMedia: InsertNVMediaCommand;
	}
}
