'use strict';

import requests from '../utils/requests';

import { generateOrderingQueryParams } from '../utils/fetch_api_utils';


let EditionListFetcher = {
    /**
     * Fetches a list of editions from the API.
     */
    fetch(pieceId, orderBy, orderAsc) {
        let ordering = generateOrderingQueryParams(orderBy, orderAsc);
        return requests.get('editions_list', { 'piece_id': pieceId, ordering });
    }
};

export default EditionListFetcher;
