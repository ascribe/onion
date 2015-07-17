'use strict';

import alt from '../alt';
import EditionFetcher from '../fetchers/edition_fetcher';


class EditionActions {
    constructor() {
        this.generateActions(
            'updateEdition'
        );
    }

    fetchOne(editionId) {
        EditionFetcher.fetchOne(editionId)
            .then((res) => {
                this.actions.updateEdition(res.edition);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(EditionActions);
