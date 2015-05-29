import AppConstants from './application_constants';

let apiUrls = {
    'ownership_shares_mail' : AppConstants.baseUrl + 'ownership/shares/mail/',
    'ownership_transfers' : AppConstants.baseUrl + 'ownership/transfers/',
    'ownership_consigns' : AppConstants.baseUrl + 'ownership/consigns/',
    'ownership_unconsigns' : AppConstants.baseUrl + 'ownership/unconsigns/',
    'ownership_unconsigns_request' : AppConstants.baseUrl + 'ownership/unconsigns/request/'
};

export default apiUrls;