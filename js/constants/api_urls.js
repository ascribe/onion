'use strict';

import AppConstants from './application_constants';

let apiUrls = {
    'ownership_shares_mail': AppConstants.apiEndpoint + 'ownership/shares/mail/',
    'ownership_transfers': AppConstants.apiEndpoint + 'ownership/transfers/',
    'user': AppConstants.apiEndpoint + 'users/',
    'pieces_list': AppConstants.apiEndpoint + 'pieces/',
    'piece': AppConstants.apiEndpoint + 'pieces/${piece_id}',
    'edition': AppConstants.apiEndpoint + 'editions/${bitcoin_id}/',
    'editions_list': AppConstants.apiEndpoint + 'pieces/${piece_id}/editions/',
    'ownership_loans': AppConstants.apiEndpoint + 'ownership/loans/',
    'ownership_consigns': AppConstants.apiEndpoint + 'ownership/consigns/',
    'ownership_unconsigns': AppConstants.apiEndpoint + 'ownership/unconsigns/',
    'ownership_unconsigns_request': AppConstants.apiEndpoint + 'ownership/unconsigns/request/'
};

export default apiUrls;
