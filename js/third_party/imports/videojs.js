import AppConstants from '../../constants/application_constants';

import { InjectInHeadUtils } from '../../utils/inject';


/**
 * Imports videojs and its stylesheet.
 *
 * @return {Promise} Promise that resolves with [video.js, video-js.css] on success.
 */
function importLib() {
    return Promise.all([
        InjectInHeadUtils.inject(AppConstants.videojs.cssUrl),
        InjectInHeadUtils.inject(AppConstants.videojs.sdkUrl)
    ]);
}

export default { importLib };
