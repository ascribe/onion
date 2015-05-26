import alt from '../alt';
import EditionAction from '../actions/edition_actions';


class EditionStore {
    constructor() {
        this.edition = {};
        this.bindActions(EditionAction);
    }

    onUpdateEdition(edition) {
        this.edition = edition;
    }
}

export default alt.createStore(EditionStore);
