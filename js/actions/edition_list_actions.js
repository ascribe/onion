'use strict';

import alt from '../alt';

import EditionListFetcher from '../fetchers/edition_list_fetcher.js';

class EditionListActions {
    constructor() {
        this.generateActions(
            'updateEditionList',
            'selectEdition',
            'clearAllEditionSelections',
            'toggleEditionList'
        );
    }

    fetchEditionList(pieceId, orderBy, orderAsc) {
        if(!orderBy && typeof orderAsc == 'undefined') {
            orderBy = 'edition_number';
            orderAsc = true;
        }

        return new Promise((resolve, reject) => {
            EditionListFetcher
                .fetch(pieceId, orderBy, orderAsc)
                .then((res) => {
                    this.actions.updateEditionList({
                        'editionListOfPiece': res.editions,
                        pieceId,
                        orderBy,
                        orderAsc
                    });
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                    console.log(err);
                });
        });
        
    }
}

export default alt.createActions(EditionListActions);
