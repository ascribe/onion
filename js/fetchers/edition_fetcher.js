import fetch from '../utils/fetch';

import AppConstants from '../constants/application_constants';
import FetchApiUtils from '../utils/fetch_api_utils';


let EditionFetcher = {
    /**
     * Fetch one user from the API.
     * If no arg is supplied, load the current user
     * 
     */
    fetchOne(editionId) {
        return fetch.get('edition', {'bitcoin_id': editionId});
    }
};

export default EditionFetcher;
