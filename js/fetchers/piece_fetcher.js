'use strict';

import requests from '../utils/requests';


let PieceFetcher = {
    /**
     * Fetch a piece from the API.
     */
    fetchOne(id) {
        return requests.get('piece', {'piece_id': id});
    }
};

export default PieceFetcher;
