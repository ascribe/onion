import alt from '../alt';
import PieceListActions from '../actions/piece_list_actions';

class PieceListStore {
    constructor() {
        this.pieceList = [];
        this.bindActions(PieceListActions);
    }

    onUpdatePieceList(pieceList) {
        this.pieceList = pieceList;
    }
};

export default alt.createStore(PieceListStore);
