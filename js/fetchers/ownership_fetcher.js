'use strict';

import requests from '../utils/requests';
import AppConstants from '../constants/application_constants';


let OwnershipFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchLoanContract(email) {
        return requests.get(AppConstants.apiEndpoint + 'ownership/loans/contract/?loanee=' + email);
    }
};

export default OwnershipFetcher;
