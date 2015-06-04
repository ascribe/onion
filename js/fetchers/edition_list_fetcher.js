import fetch from '../utils/fetch';

import { generateOrderingQueryParams } from '../utils/fetch_api_utils';

import AppConstants from '../constants/application_constants';


let EditionListFetcher = {
    /**
     * Fetches a list of editions from the API.
     */
    fetch(pieceId, orderBy, orderAsc) {
        let ordering = generateOrderingQueryParams(orderBy, orderAsc);
        return fetch.get('editions_list', { 'piece_id': pieceId, ordering });
    }
};

export default EditionListFetcher;
