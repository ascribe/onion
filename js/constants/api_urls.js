'use strict';

import AppConstants from './application_constants';

let apiUrls = {
    'ownership_shares_mail': AppConstants.baseUrl + 'ownership/shares/mail/',
    'ownership_transfers': AppConstants.baseUrl + 'ownership/transfers/',
    'user': AppConstants.baseUrl + 'users/',
    'piece': AppConstants.baseUrl + 'pieces/${piece_id}',
    'pieces_list': AppConstants.baseUrl + 'pieces/',
    'piece_extradata': AppConstants.baseUrl + 'pieces/${piece_id}/extradata/',
    'edition': AppConstants.baseUrl + 'editions/${bitcoin_id}/',
    'editions_list': AppConstants.baseUrl + 'pieces/${piece_id}/editions/',
    'edition_delete': AppConstants.baseUrl + 'editions/${edition_id}/',
    'ownership_loans': AppConstants.baseUrl + 'ownership/loans/',
    'ownership_consigns': AppConstants.baseUrl + 'ownership/consigns/',
    'ownership_unconsigns': AppConstants.baseUrl + 'ownership/unconsigns/',
    'ownership_unconsigns_request': AppConstants.baseUrl + 'ownership/unconsigns/request/',
    'note_notes': AppConstants.baseUrl + 'note/notes/'

};

export default apiUrls;
