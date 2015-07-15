'use strict';

import requests from '../utils/requests';

import ApiUrls from '../constants/api_urls';

let OwnershipFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchLoanContract(email) {
        return requests.get(ApiUrls.ownership_loans_contract + '?loanee=' + email);
    }
};

export default OwnershipFetcher;
