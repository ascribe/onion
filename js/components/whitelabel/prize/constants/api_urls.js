'use strict';

import AppConstants from '../../../../constants/application_constants';

function getApiUrls(subdomain) {
    return {
        'pieces_list': AppConstants.apiEndpoint + 'prize/' + subdomain + '/pieces/',
        'users_login': AppConstants.apiEndpoint + 'prize/' + subdomain + '/users/login/',
        'users_signup': AppConstants.apiEndpoint + 'prize/' + subdomain + '/users/',
        'user': AppConstants.apiEndpoint + 'prize/' + subdomain + '/users/'
    };
}

export default getApiUrls;
