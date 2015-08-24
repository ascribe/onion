'use strict';

import requests from '../utils/requests';

import ApiUrls from '../constants/api_urls';

let OwnershipFetcher = {
    /**
     * Fetch the default, public loan contract of a user from the API.
     */
    fetchLoanContract(email) {
        return requests.get(ApiUrls.ownership_loans_contract + '?loanee=' + email);
    },

    /**
     * Fetch the contracts of the logged-in user from the API.
     */
    fetchLoanContractList(){
        return requests.get(ApiUrls.ownership_loans_contract);
    }

};

export default OwnershipFetcher;
