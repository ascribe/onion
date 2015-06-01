import AppConstants from './application_constants';

let apiUrls = {
    'ownership_shares_mail' : AppConstants.baseUrl + 'ownership/shares/mail/',
    'ownership_transfers' : AppConstants.baseUrl + 'ownership/transfers/',

    'user': AppConstants.baseUrl + 'users/',

    'pieces_list': AppConstants.baseUrl + 'pieces/',
    'piece': AppConstants.baseUrl + 'pieces/${piece_id}',

    'edition': AppConstants.baseUrl + 'editions/${bitcoin_id}/',
    'editions_list': AppConstants.baseUrl + 'pieces/${piece_id}/editions/'
};

export default apiUrls;
