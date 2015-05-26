import alt from '../alt';
import PieceAction from '../actions/piece_actions';


class PieceStore {
    constructor() {
        this.piece = {}
        this.bindActions(PieceAction);
    }

    onUpdatePiece(piece) {
        this.piece = piece;
    }
};

export default alt.createStore(PieceStore);
