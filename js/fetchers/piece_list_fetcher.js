import AppConstants from '../constants/application_constants';
import { generateOrderingQueryParams } from '../utils/fetch_api_utils';
import fetch from '../utils/fetch';


let PieceListFetcher = {
    /**
     * Fetches a list of pieces from the API.
     * Can be called with all supplied queryparams the API.
     */
    fetch(page, pageSize, search, orderBy, orderAsc) {
        let ordering = generateOrderingQueryParams(orderBy, orderAsc);
        return fetch.get('pieces_list', { page, pageSize, search, ordering });
    }
};

export default PieceListFetcher;
