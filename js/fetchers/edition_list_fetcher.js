'use strict';

import requests from '../utils/requests';

import { mergeOptions } from '../utils/general_utils';
import { generateOrderingQueryParams } from '../utils/url_utils';

let EditionListFetcher = {
    /**
     * Fetches a list of editions from the API.
     */
    fetch({ pieceId, page, pageSize, orderBy, orderAsc, filterBy }) {
        const ordering = generateOrderingQueryParams(orderBy, orderAsc);

        const queryParams = mergeOptions(
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
