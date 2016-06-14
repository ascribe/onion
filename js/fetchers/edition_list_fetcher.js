'use strict';

import request from '../utils/request';

import { safeMerge } from '../utils/general';
import { generateOrderingQueryParams } from '../utils/url';

let EditionListFetcher = {
    /**
     * Fetches a list of editions from the API.
     */
    fetch({ pieceId, page, pageSize, orderBy, orderAsc, filterBy }) {
        const ordering = generateOrderingQueryParams(orderBy, orderAsc);
        const query = safeMerge(
            {
                page,
                pageSize,
                ordering
            },
            filterBy
        );

        return request('editions_list', {
            query,
            urlTemplateSpec: { pieceId }
        });
    }
};

export default EditionListFetcher;
