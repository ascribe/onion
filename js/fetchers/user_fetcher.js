import fetch from 'isomorphic-fetch';

import AppConstants from '../constants/application_constants';
import FetchApiUtils from '../utils/fetch_api_utils';


let UserFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     * 
     */
    fetchOne() {
        return fetch(AppConstants.baseUrl + 'users/', {
            headers: {
                'Authorization': 'Basic ' + AppConstants.debugCredentialBase64
            }
        }).then((res) => res.json());
    }
};

export default UserFetcher;
