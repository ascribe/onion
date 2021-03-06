'use strict';

import requests from '../utils/requests';

import { mergeOptions } from '../utils/general_utils';
import { generateOrderingQueryParams } from '../utils/url_utils';

let PieceListFetcher = {
    /**
     * Fetches a list of pieces from the API.
     * Can be called with all supplied queryparams the API.
     */
    fetch({ page, pageSize, search, orderBy, orderAsc, filterBy }) {
        const ordering = generateOrderingQueryParams(orderBy, orderAsc);

        // filterBy is an object of acl key-value pairs.
        // The values are booleans
        const queryParams = mergeOptions(
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
    }
};

export default PieceListFetcher;
