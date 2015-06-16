'use strict';

import requests from '../utils/requests';

let EditionFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchOne(editionId) {
        return requests.get('edition', {'bitcoin_id': editionId});
    }
};

export default EditionFetcher;
