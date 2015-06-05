'use strict';

import fetch from 'isomorphic-fetch';

import AppConstants from '../constants/application_constants';


let OwnershipFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchLoanContract(email) {
        return fetch(AppConstants.baseUrl + 'ownership/loans/contract/?loanee=' + email, {
            headers: {
                'Authorization': 'Basic ' + AppConstants.debugCredentialBase64
            }
        }).then(
            (res) => res.json()
        );
    }
};

export default OwnershipFetcher;
