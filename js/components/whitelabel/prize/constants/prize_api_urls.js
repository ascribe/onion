'use strict';

import AppPrizeConstants from './prize_application_constants';

function getPrizeApiUrls(subdomain) {
    return {
        'pieces_list': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/',
        'users_login': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/login/',
        'users_signup': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/',
        'user': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/',
        'piece_submit_to_prize': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/${piece_id}/submit/',
        'piece': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/${piece_id}/',
        'prize': AppPrizeConstants.prizeApiEndpoint + subdomain + '/',
        'jurys': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/',
        'jury': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/${email}/',
        'jury_activate': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/${email}/activate/',
        'jury_resend': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/${email}/resend/',
        'ratings': AppPrizeConstants.prizeApiEndpoint + subdomain + '/ratings/',
        'rating': AppPrizeConstants.prizeApiEndpoint + subdomain + '/ratings/${piece_id}/',
        'notes': AppPrizeConstants.prizeApiEndpoint + subdomain + '/notes/',
        'note': AppPrizeConstants.prizeApiEndpoint + subdomain + '/notes/${piece_id}/'

    };
}

export default getPrizeApiUrls;
