'use strict';

import AppPrizeConstants from './prize_application_constants';


function getPrizeApiUrls(subdomain) {
    return {
        'users_login': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/login/',
        'users_signup': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/',
        'user': AppPrizeConstants.prizeApiEndpoint + subdomain + '/users/',
        'piece_submit_to_prize': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/${piece_id}/submit/',
        'pieces_list': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/',
        'piece': AppPrizeConstants.prizeApiEndpoint + subdomain + '/pieces/${piece_id}/',
        'prize': AppPrizeConstants.prizeApiEndpoint + subdomain + '/',
        'jurys': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/',
        'jury': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/${email}/',
        'jury_activate': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/${email}/activate/',
        'jury_resend': AppPrizeConstants.prizeApiEndpoint + subdomain + '/jury/${email}/resend/',
        'ratings': AppPrizeConstants.prizeApiEndpoint + subdomain + '/ratings/',
        'rating': AppPrizeConstants.prizeApiEndpoint + subdomain + '/ratings/${piece_id}/',
        'rating_average': AppPrizeConstants.prizeApiEndpoint + subdomain + '/ratings/${piece_id}/average/',
        'select_piece': AppPrizeConstants.prizeApiEndpoint + subdomain + '/ratings/${piece_id}/select/',
        'notes': AppPrizeConstants.prizeApiEndpoint + subdomain + '/notes/',
        'note': AppPrizeConstants.prizeApiEndpoint + subdomain + '/notes/${piece_id}/'
    };
}

export default getPrizeApiUrls;
