import fetch from 'isomorphic-fetch';

import AppConstants from '../constants/application_constants';
import FetchApiUtils from '../utils/fetch_api_utils';

var ArtworkListFetcher = {
    fetch(page=1, pageSize=10) {
        let params = FetchApiUtils.argsToQueryParams({
            page,
            pageSize
        });

        return fetch(AppConstants.baseUrl + 'pieces/' + params, {
            headers: {
                'Authorization': 'Basic ZGltaUBtYWlsaW5hdG9yLmNvbTowMDAwMDAwMDAw'
            }
        }).then((res) => res.json());
    }
};

export default ArtworkListFetcher;