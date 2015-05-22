import alt from '../alt';
import EditionsListActions from '../actions/edition_list_actions';

class EditionListStore {
    constructor() {
        this.editionList = [];
        this.bindActions(EditionsListActions);
    }

    onUpdateEditionList(editionList) {
        this.editionList = editionList;
    }
};

export default alt.createStore(EditionListStore);