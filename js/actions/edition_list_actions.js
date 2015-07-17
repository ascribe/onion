'use strict';

import alt from '../alt';

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

    fetchEditionList(pieceId, page, pageSize, orderBy, orderAsc) {
        if(!orderBy && typeof orderAsc === 'undefined') {
            orderBy = 'edition_number';
            orderAsc = true;
        }

        // Taken from: http://stackoverflow.com/a/519157/1263876
        if(typeof page === 'undefined' && typeof pageSize === 'undefined') {
            page = 1;
            pageSize = 10;
        }

        return new Promise((resolve, reject) => {
            EditionListFetcher
                .fetch(pieceId, page, pageSize, orderBy, orderAsc)
                .then((res) => {
                    this.actions.updateEditionList({
                        pieceId,
                        page,
                        pageSize,
                        orderBy,
                        orderAsc,
                        'editionListOfPiece': res.editions,
                        'count': res.count
                    });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
        
    }
}

export default alt.createActions(EditionListActions);
