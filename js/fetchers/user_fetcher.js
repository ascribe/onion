'use strict';

import requests from '../utils/requests';
import apiUrls from '../constants/api_urls';

let UserFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchOne() {
        return requests.get('user');
    },

    logout() {
        return requests.get(apiUrls.users_logout);
    }
};

export default UserFetcher;
