'use strict';

import requests from '../utils/requests';

let CoaFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     */
    fetchOne(id) {
        return requests.get('coa', {'id': id});
    },
    create(bitcoinId) {
        console.log(bitcoinId);
        return requests.post('coa_create', {body: {'bitcoin_id': bitcoinId}});
    }
};

export default CoaFetcher;
