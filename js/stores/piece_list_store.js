import alt from '../alt';
import PieceListActions from '../actions/piece_list_actions';


class PieceListStore {
    constructor() {
        this.itemList = []; // rename this to pieceList after figuring out AltContainer transform
        this.bindActions(PieceListActions);
    }

    onUpdatePieceList(itemList) {
        this.itemList = itemList;
    }
};

export default alt.createStore(PieceListStore);
