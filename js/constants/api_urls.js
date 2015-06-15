'use strict';

import AppConstants from './application_constants';

let apiUrls = {
    'piece': AppConstants.apiEndpoint + 'pieces/${piece_id}',
    'pieces_list': AppConstants.apiEndpoint + 'pieces/',
    'piece_extradata': AppConstants.apiEndpoint + 'pieces/${piece_id}/extradata/',
    'edition': AppConstants.apiEndpoint + 'editions/${bitcoin_id}/',
    'editions_list': AppConstants.apiEndpoint + 'pieces/${piece_id}/editions/',
    'edition_delete': AppConstants.apiEndpoint + 'editions/${edition_id}/',
    'edition_remove_from_collection': AppConstants.apiEndpoint + 'ownership/shares/${edition_id}/',
    'ownership_shares_mail': AppConstants.apiEndpoint + 'ownership/shares/mail/',
    'ownership_transfers': AppConstants.apiEndpoint + 'ownership/transfers/',
    'ownership_consigns': AppConstants.apiEndpoint + 'ownership/consigns/',
    'ownership_consigns_confirm': AppConstants.apiEndpoint + 'ownership/consigns/confirm/',
    'ownership_consigns_deny': AppConstants.apiEndpoint + 'ownership/consigns/deny/',
    'ownership_unconsigns': AppConstants.apiEndpoint + 'ownership/unconsigns/',
    'ownership_unconsigns_request': AppConstants.apiEndpoint + 'ownership/unconsigns/request/',
    'ownership_unconsigns_deny': AppConstants.apiEndpoint + 'ownership/unconsigns/deny/',
    'ownership_loans': AppConstants.apiEndpoint + 'ownership/loans/',
    'ownership_loans_confirm': AppConstants.apiEndpoint + 'ownership/loans/confirm/',
    'ownership_loans_deny': AppConstants.apiEndpoint + 'ownership/loans/deny/',
    'note_notes': AppConstants.apiEndpoint + 'note/notes/',
    'user': AppConstants.apiEndpoint + 'users/',
    'users_login': AppConstants.apiEndpoint + 'users/login/',
    'users_logout': AppConstants.apiEndpoint + 'users/logout/',
    'users_signup': AppConstants.apiEndpoint + 'users/',
    'users_password_reset_request': AppConstants.apiEndpoint + 'users/request_reset_password/',
    'users_password_reset': AppConstants.apiEndpoint + 'users/reset_password/'
};

export default apiUrls;
