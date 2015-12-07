'use strict';

import { alt } from '../alt';
import EditionActions from '../actions/edition_actions';


class EditionStore {
    constructor() {
        this.edition = {};
        this.editionError = null;
        this.bindActions(EditionActions);
    }

    onUpdateEdition(edition) {
        this.edition = edition;
        this.editionError = null;
    }

    onEditionFailed(error) {
        this.editionError = error;
    }
}

export default alt.createStore(EditionStore, 'EditionStore');
