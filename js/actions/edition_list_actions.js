'use strict';

import { alt } from '../alt';
import Q from 'q';

import EditionListFetcher from '../fetchers/edition_list_fetcher.js';

class EditionListActions {
    constructor() {
        this.generateActions(
            'updateEditionList',
            'refreshEditionList',
            'selectEdition',
            'clearAllEditionSelections',
            'closeAllEditionLists',
            'toggleEditionList'
        );
    }

    fetchEditionList({pieceId, page, pageSize, orderBy, orderAsc, filterBy, maxEdition}) {
        if ((!orderBy && typeof orderAsc === 'undefined') || !orderAsc) {
            orderBy = 'edition_number';
            orderAsc = true;
        }

        // Taken from: http://stackoverflow.com/a/519157/1263876
        if ((typeof page === 'undefined' || !page) && (typeof pageSize === 'undefined' || !pageSize)) {
            page = 1;
            pageSize = 10;
        }

        let itemsToFetch = pageSize;
        // If we only want to fetch up to a specified edition, fetch all pages up to it
        // as one page and adjust afterwards
        if (typeof maxEdition === 'number') {
            itemsToFetch = Math.ceil(maxEdition / pageSize) * pageSize;
            page = 1;
        }

        return Q.Promise((resolve, reject) => {
            EditionListFetcher
                .fetch({pieceId, page, itemsToFetch, orderBy, orderAsc, filterBy})
                .then((res) => {
                    if (res && !res.editions) {
                        throw new Error('Piece has no editions to fetch.');
                    }

                    this.actions.updateEditionList({
                        pieceId,
                        page,
                        pageSize,
                        orderBy,
                        orderAsc,
                        filterBy,
                        maxEdition,
                        count: res.count,
                        editionListOfPiece: res.editions
                    });
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }
}

export default alt.createActions(EditionListActions);
