'use strict';

import AppConstants from './application_constants';

let apiUrls = {
    'user': AppConstants.baseUrl + 'users/',
    'piece': AppConstants.baseUrl + 'pieces/${piece_id}',
    'pieces_list': AppConstants.baseUrl + 'pieces/',
    'piece_extradata': AppConstants.baseUrl + 'pieces/${piece_id}/extradata/',
    'edition': AppConstants.baseUrl + 'editions/${bitcoin_id}/',
    'editions_list': AppConstants.baseUrl + 'pieces/${piece_id}/editions/',
    'edition_delete': AppConstants.baseUrl + 'editions/${edition_id}/',
    'edition_remove_from_collection': AppConstants.baseUrl + 'ownership/shares/${edition_id}/',
    'ownership_shares_mail': AppConstants.baseUrl + 'ownership/shares/mail/',
    'ownership_transfers': AppConstants.baseUrl + 'ownership/transfers/',
    'ownership_consigns': AppConstants.baseUrl + 'ownership/consigns/',
    'ownership_consigns_confirm': AppConstants.baseUrl + 'ownership/consigns/confirm/',
    'ownership_consigns_deny': AppConstants.baseUrl + 'ownership/consigns/deny/',
    'ownership_unconsigns': AppConstants.baseUrl + 'ownership/unconsigns/',
    'ownership_unconsigns_request': AppConstants.baseUrl + 'ownership/unconsigns/request/',
    'ownership_unconsigns_deny': AppConstants.baseUrl + 'ownership/unconsigns/deny/',
    'ownership_loans': AppConstants.baseUrl + 'ownership/loans/',
    'ownership_loans_confirm': AppConstants.baseUrl + 'ownership/loans/confirm/',
    'ownership_loans_deny': AppConstants.baseUrl + 'ownership/loans/deny/',

    'note_notes': AppConstants.baseUrl + 'note/notes/'

};

export default apiUrls;
