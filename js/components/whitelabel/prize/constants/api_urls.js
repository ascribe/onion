'use strict';

import AppPrizeConstants from './application_prize_constants';

function getApiUrls(subdomain) {
    return {
        'pieces_list': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/',
        'users_login': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/login/',
        'users_signup': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/',
        'user': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/',
        'piece_submit_to_prize': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/${piece_id}/submit/',
        'piece': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/${piece_id}/'
    };
}

export default getApiUrls;
