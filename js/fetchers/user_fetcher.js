'use strict';

import requests from '../utils/requests';


let UserFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchOne() {
        return requests.get('user');
    }
};

export default UserFetcher;
