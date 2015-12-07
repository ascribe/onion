'use strict';

import { alt } from '../alt';
import EditionFetcher from '../fetchers/edition_fetcher';


class EditionActions {
    constructor() {
        this.generateActions(
            'updateEdition',
            'editionFailed'
        );
    }

    fetchOne(editionId) {
        EditionFetcher.fetchOne(editionId)
            .then((res) => {
                this.actions.updateEdition(res.edition);
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.editionFailed(err.json);
            });
    }
}

export default alt.createActions(EditionActions);
