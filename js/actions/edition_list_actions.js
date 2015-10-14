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

    fetchEditionList(pieceId, page, pageSize, orderBy, orderAsc, filterBy) {
        if((!orderBy && typeof orderAsc === 'undefined') || !orderAsc) {
            orderBy = 'edition_number';
            orderAsc = true;
        }

        // Taken from: http://stackoverflow.com/a/519157/1263876
        if((typeof page === 'undefined' || !page) && (typeof pageSize === 'undefined' || !pageSize)) {
            page = 1;
            pageSize = 10;
        }

        return Q.Promise((resolve, reject) => {
            EditionListFetcher
                .fetch(pieceId, page, pageSize, orderBy, orderAsc, filterBy)
                .then((res) => {
                    if(res && !res.editions) {
                        throw new Error('Piece has no editions to fetch.');
                    }

                    this.actions.updateEditionList({
                        pieceId,
                        page,
                        pageSize,
                        orderBy,
                        orderAsc,
                        filterBy,
                        'editionListOfPiece': res.editions,
                        'count': res.count
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
