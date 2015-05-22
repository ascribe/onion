import alt from '../alt';

import EditionListFetcher from '../fetchers/edition_list_fetcher.js';

class EditionListActions {
    constructor() {
        this.generateActions(
            'updateEditionList'
        );
    }

    fetchList(pieceId) {
        EditionListFetcher
            .fetch(pieceId)
            .then((res) => {
                this.actions.updateEditionList(res.editions);
            })
            .catch((err) => {
                console.log(err);
            });
    }
};

export default alt.createActions(EditionListActions);