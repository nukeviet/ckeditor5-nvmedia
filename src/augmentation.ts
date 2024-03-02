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
	NVMediaCommand,
	NVMediaConfig,
	NVMediaEditing,
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
		[NVMediaEditing.pluginName]: NVMediaEditing;
	}

	interface CommandsMap {
		nvmedia: NVMediaCommand;
	}
}
