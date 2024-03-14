/**
 * NukeViet NVMedia for CKEditor5
 * @version 4.x
 * @author VINADES.,JSC <contact@vinades.vn>
 * @copyright (C) 2009-2024 VINADES.,JSC. All rights reserved
 * @license GNU/GPL version 2 or any later version
 * @see https://github.com/nukeviet The NukeViet CMS GitHub project
 */

/**
 * @module nvmedia
 */

export { default as NVMedia } from './nvmedia.js';
export { default as NVMediaUtils } from './nvmediauntils.js';
export { default as NVMediaEditing } from './nvmediaediting.js';
export { default as NVMediaInsertUI } from './mediainsert/nvmediainsertui.js';
export { default as NVMediaInsertViaUrl } from './nvmediainsertviaurl.js';

export type { NVMediaConfig } from './nvmediaconfig.js';
export type { default as NVMediaInsertCommand } from './nvmediainsertcommand.js';
export type { default as ReplaceNVMediaSourceCommand } from './media/replacenvmediasourcecommand.js';
export type { default as InsertNVMediaCommand } from './media/insertnvmediacommand.js';

import './augmentation.js';
