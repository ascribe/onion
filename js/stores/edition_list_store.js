import alt from '../alt';
import EditionsListActions from '../actions/edition_list_actions';

class EditionListStore {
    constructor() {
        this.itemList = [];
        this.bindActions(EditionsListActions);
    }

    onUpdateEditionList(itemList) {
        this.itemList = itemList;
    }
};

export default alt.createStore(EditionListStore);