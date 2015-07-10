'use strict';

import AppConstants from './application_constants';

let apiUrls = {
    'applications': AppConstants.apiEndpoint + 'applications/',
    'application_token_refresh': AppConstants.apiEndpoint + 'applications/refresh_token/',
    'blob_digitalworks': AppConstants.apiEndpoint + 'blob/digitalworks/',
    'blob_otherdatas': AppConstants.apiEndpoint + 'blob/otherdatas/',
    'coa': AppConstants.apiEndpoint + 'coa/${id}/',
    'coa_create': AppConstants.apiEndpoint + 'coa/',
    'coa_verify': AppConstants.apiEndpoint + 'coa/verify_coa/',
    'edition': AppConstants.apiEndpoint + 'editions/${bitcoin_id}/',
    'edition_delete': AppConstants.apiEndpoint + 'editions/${edition_id}/',
    'edition_remove_from_collection': AppConstants.apiEndpoint + 'ownership/shares/${edition_id}/',
    'editions': AppConstants.apiEndpoint + 'editions/', // this should be moved to the one below
    'editions_list': AppConstants.apiEndpoint + 'pieces/${piece_id}/editions/',
    'licenses': AppConstants.apiEndpoint + 'ownership/licenses/',
    'note_notes': AppConstants.apiEndpoint + 'note/notes/',
    'note_edition': AppConstants.apiEndpoint + 'note/edition_notes/',
    'ownership_consigns': AppConstants.apiEndpoint + 'ownership/consigns/',
    'ownership_consigns_confirm': AppConstants.apiEndpoint + 'ownership/consigns/confirm/',
    'ownership_consigns_deny': AppConstants.apiEndpoint + 'ownership/consigns/deny/',
    'ownership_loans': AppConstants.apiEndpoint + 'ownership/loans/',
    'ownership_loans_confirm': AppConstants.apiEndpoint + 'ownership/loans/confirm/',
    'ownership_loans_deny': AppConstants.apiEndpoint + 'ownership/loans/deny/',
    'ownership_loans_contract': AppConstants.apiEndpoint + 'ownership/loans/contract/',
    'ownership_shares': AppConstants.apiEndpoint + 'ownership/shares/',
    'ownership_transfers': AppConstants.apiEndpoint + 'ownership/transfers/',
    'ownership_transfers_withdraw': AppConstants.apiEndpoint + 'ownership/transfers/withdraw/',
    'ownership_unconsigns': AppConstants.apiEndpoint + 'ownership/unconsigns/',
    'ownership_unconsigns_deny': AppConstants.apiEndpoint + 'ownership/unconsigns/deny/',
    'ownership_unconsigns_request': AppConstants.apiEndpoint + 'ownership/unconsigns/request/',
    'piece': AppConstants.apiEndpoint + 'pieces/${piece_id}/',
    'piece_extradata': AppConstants.apiEndpoint + 'pieces/${piece_id}/extradata/',
    'piece_first_edition_id': AppConstants.apiEndpoint + 'pieces/${piece_id}/edition_index/',
    'pieces_list': AppConstants.apiEndpoint + 'pieces/',
    'pieces_list_request_actions': AppConstants.apiEndpoint + 'pieces/request_actions/',
    'user': AppConstants.apiEndpoint + 'users/',
    'users_login': AppConstants.apiEndpoint + 'users/login/',
    'users_logout': AppConstants.apiEndpoint + 'users/logout/',
    'users_password_reset': AppConstants.apiEndpoint + 'users/reset_password/',
    'users_password_reset_request': AppConstants.apiEndpoint + 'users/request_reset_password/',
    'users_signup': AppConstants.apiEndpoint + 'users/',
    'users_username': AppConstants.apiEndpoint + 'users/username/',
    'wallet_settings': AppConstants.apiEndpoint + 'users/wallet_settings/',
    'whitelabel_settings': AppConstants.apiEndpoint + 'whitelabel/settings/${subdomain}/',
    'delete_s3_file': AppConstants.serverUrl + 's3/delete/'
};

export default apiUrls;
