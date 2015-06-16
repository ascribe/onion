'use strict';

import AppConstants from './application_constants';

let apiUrls = {
    'edition': AppConstants.apiEndpoint + 'editions/${bitcoin_id}/',
    'edition_delete': AppConstants.apiEndpoint + 'editions/${edition_id}/',
    'edition_remove_from_collection': AppConstants.apiEndpoint + 'ownership/shares/${edition_id}/',
    'editions_list': AppConstants.apiEndpoint + 'pieces/${piece_id}/editions/',
    'note_notes': AppConstants.apiEndpoint + 'note/notes/',
    'ownership_consigns': AppConstants.apiEndpoint + 'ownership/consigns/',
    'ownership_consigns_confirm': AppConstants.apiEndpoint + 'ownership/consigns/confirm/',
    'ownership_consigns_deny': AppConstants.apiEndpoint + 'ownership/consigns/deny/',
    'ownership_loans': AppConstants.apiEndpoint + 'ownership/loans/',
    'ownership_loans_confirm': AppConstants.apiEndpoint + 'ownership/loans/confirm/',
    'ownership_loans_deny': AppConstants.apiEndpoint + 'ownership/loans/deny/',
    'ownership_shares_mail': AppConstants.apiEndpoint + 'ownership/shares/mail/',
    'ownership_transfers': AppConstants.apiEndpoint + 'ownership/transfers/',
    'ownership_unconsigns': AppConstants.apiEndpoint + 'ownership/unconsigns/',
    'ownership_unconsigns_deny': AppConstants.apiEndpoint + 'ownership/unconsigns/deny/',
    'ownership_unconsigns_request': AppConstants.apiEndpoint + 'ownership/unconsigns/request/',
    'piece': AppConstants.apiEndpoint + 'pieces/${piece_id}',
    'piece_extradata': AppConstants.apiEndpoint + 'pieces/${piece_id}/extradata/',
    'pieces_list': AppConstants.apiEndpoint + 'pieces/',
    'user': AppConstants.apiEndpoint + 'users/',
    'users_login': AppConstants.apiEndpoint + 'users/login/',
    'users_logout': AppConstants.apiEndpoint + 'users/logout/',
    'users_password_reset': AppConstants.apiEndpoint + 'users/reset_password/',
    'users_password_reset_request': AppConstants.apiEndpoint + 'users/request_reset_password/',
    'users_signup': AppConstants.apiEndpoint + 'users/'
};

export default apiUrls;
