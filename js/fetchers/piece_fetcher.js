import fetch from '../utils/fetch';

import AppConstants from '../constants/application_constants';


let PieceFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     * 
     */
    fetchOne(pieceId) {
        return fetch.get('piece');
    }
};

export default PieceFetcher;
