'use strict';

import AppConstants from '../../../../constants/application_constants';

function getApiUrls(subdomain) {
    return {
        'pieces_list': AppConstants.apiEndpoint + 'prize/' + subdomain + '/pieces/',
        'users_login': AppConstants.apiEndpoint + 'prize/' + subdomain + '/users/login/',
        'users_signup': AppConstants.apiEndpoint + 'prize/' + subdomain + '/users/',
        'user': AppConstants.apiEndpoint + 'prize/' + subdomain + '/users/',
        'piece_submit_to_prize': AppConstants.apiEndpoint + 'prize/' + subdomain + '/pieces/${piece_id}/submit/',
        'piece': AppConstants.apiEndpoint + 'prize/' + subdomain + '/pieces/${piece_id}/'
    };
}

export default getApiUrls;
