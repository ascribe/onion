'use strict';

import { generateOrderingQueryParams } from '../utils/fetch_api_utils';
import requests from '../utils/requests';


let PieceListFetcher = {
    /**
     * Fetches a list of pieces from the API.
     * Can be called with all supplied queryparams the API.
     */
    fetch(page, pageSize, search, orderBy, orderAsc) {
        let ordering = generateOrderingQueryParams(orderBy, orderAsc);
        return requests.get('pieces_list', { page, pageSize, search, ordering });
    },

    fetchRequestActions() {
        return requests.get('pieces_list_request_actions');
    }
};

export default PieceListFetcher;
