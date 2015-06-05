'use strict';

import alt from '../alt';
import EditionActions from '../actions/edition_actions';


class EditionStore {
    constructor() {
        this.edition = {};
        this.bindActions(EditionActions);
    }

    onUpdateEdition(edition) {
        this.edition = edition;
    }
}

export default alt.createStore(EditionStore);
