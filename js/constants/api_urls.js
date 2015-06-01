import AppConstants from './application_constants';

let apiUrls = {
    'ownership_shares_mail' : AppConstants.baseUrl + 'ownership/shares/mail/',
    'ownership_transfers' : AppConstants.baseUrl + 'ownership/transfers/',
    'pieces_list': AppConstants.baseUrl + 'pieces/',
    'edition': AppConstants.baseUrl + 'editions/${bitcoin_id}/'
};

export default apiUrls;
