import AppConstants from '../../constants/application_constants';

import { InjectInHeadUtils } from '../../utils/inject';


/**
 * Imports audiojs from the copied directory.
 *
 * Unfortunately, audiojs' package structure and the way it currently loads image assets prevents us
 * from using System.import.
 *
 * @return {Promise} Promise that resolves with [audio.min.js] on success.
 */
function importLib() {
    return InjectInHeadUtils.inject(AppConstants.audiojs.sdkUrl);
}

export default { importLib };
