'use strict';

import requests from '../utils/requests';

import { generateOrderingQueryParams } from '../utils/fetch_api_utils';
import { mergeOptions } from '../utils/general_utils';

let EditionListFetcher = {
    /**
     * Fetches a list of editions from the API.
     */
    fetch(pieceId, page, pageSize, orderBy, orderAsc, filterBy) {
        let ordering = generateOrderingQueryParams(orderBy, orderAsc);

        let queryParams = mergeOptions(
            {
                page,
                pageSize,
                ordering,
                piece_id: pieceId
            },
            filterBy
        );

        return requests.get('editions_list', queryParams);
    }
};

export default EditionListFetcher;
