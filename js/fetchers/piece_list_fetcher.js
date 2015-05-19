import fetch from 'isomorphic-fetch';

import AppConstants from '../constants/application_constants';
import FetchApiUtils from '../utils/fetch_api_utils';

var PieceListFetcher = {
    /**
     * Fetches a list of pieces from the API.
     * Can be called with all supplied queryparams the API.
     * 
     * 
     */
    fetch(page, pageSize, search, ordering) {

        let params = FetchApiUtils.argsToQueryParams({
            page,
            pageSize,
            search,
            ordering
        });

        return fetch(AppConstants.baseUrl + 'pieces/' + params, {
            headers: {
                'Authorization': 'Basic ' + AppConstants.debugCredentialBase64
            }
        }).then((res) => res.json());
    }
};

export default PieceListFetcher;