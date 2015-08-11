'use strict';

import requests from '../utils/requests';

import { mergeOptions } from '../utils/general_utils';
import { generateOrderingQueryParams } from '../utils/fetch_api_utils';

let PieceListFetcher = {
    /**
     * Fetches a list of pieces from the API.
     * Can be called with all supplied queryparams the API.
     */
    fetch(page, pageSize, search, orderBy, orderAsc, filterBy) {
        let ordering = generateOrderingQueryParams(orderBy, orderAsc);

        // filterBy is an object of acl key-value pairs.
        // The values are booleans
        let queryParams = mergeOptions(
            {
                page,
                pageSize,
                search,
                ordering
            },
            filterBy
        );

        return requests.get('pieces_list', queryParams);
    },

    fetchRequestActions() {
        return requests.get('pieces_list_request_actions');
    },

    fetchFirstEditionForPiece(pieceId) {
        return requests.get('piece_first_edition_id', {'piece_id': pieceId});
    }
};

export default PieceListFetcher;
