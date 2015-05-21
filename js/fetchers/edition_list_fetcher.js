import fetch from 'isomorphic-fetch';

import AppConstants from '../constants/application_constants';


let EditionListFetcher = {
    /**
     * Fetches a list of editions from the API.
     */
    fetch() {

        return fetch(AppConstants.baseUrl + 'pieces/', {
            headers: {
                'Authorization': 'Basic ' + AppConstants.debugCredentialBase64
            }
        }).then((res) => res.json());
    }
};

export default EditionListFetcher;