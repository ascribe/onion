import alt from '../alt';
import EditionsListActions from '../actions/edition_list_actions';

class EditionListStore {
    constructor() {
        this.editionList = {};
        this.bindActions(EditionsListActions);
    }

    onUpdateEditionList({pieceId, editionList}) {
        this.editionList[pieceId] = editionList;
    }
};

export default alt.createStore(EditionListStore);