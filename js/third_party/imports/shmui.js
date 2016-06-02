import AppConstants from '../../constants/application_constants';

import { InjectInHeadUtils } from '../../utils/inject_utils';


/**
 * Imports shmui and its dependencies (jQuery)
 *
 * @return {Promise} Promise that resolves with [jquery.shmui.js, shmui.css] on success.
 */
function importLib() {
    return InjectInHeadUtils.inject(AppConstants.jquery.sdkUrl)
        .then(() => Promise.all([
            System.import('shmui/jquery.shmui.js'),
            System.import('shmui/shmui.css')
        ]))
}

export default { importLib };
