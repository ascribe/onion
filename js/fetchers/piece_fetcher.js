'use strict';

import requests from '../utils/requests';


let PieceFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchOne() {
        return requests.get('piece');
    }
};

export default PieceFetcher;
