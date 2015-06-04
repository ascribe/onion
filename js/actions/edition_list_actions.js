import alt from '../alt';

import EditionListFetcher from '../fetchers/edition_list_fetcher.js';

class EditionListActions {
    constructor() {
        this.generateActions(
            'updateEditionList',
            'selectEdition',
            'clearAllEditionSelections'
        );
    }

    fetchEditionList(pieceId, orderBy, orderAsc) {
        EditionListFetcher
            .fetch(pieceId, orderBy, orderAsc)
            .then((res) => {
                this.actions.updateEditionList({
                    'editionListOfPiece': res.editions,
                    pieceId,
                    orderBy,
                    orderAsc
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default alt.createActions(EditionListActions);