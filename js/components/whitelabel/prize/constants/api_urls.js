'use strict';

import AppConstants from '../../../../constants/application_constants';

function getApiUrls(subdomain) {
    return {
        'pieces_list': AppConstants.apiEndpoint + 'prize/' + subdomain + '/pieces/'
    };
}

export default getApiUrls;
