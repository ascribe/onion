'use strict';

import fetch from '../utils/fetch';


let UserFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchOne() {
        return fetch.get('user');
    }
};

export default UserFetcher;
