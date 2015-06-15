'use strict';

import alt from '../alt';
import PieceActions from '../actions/piece_actions';


class PieceStore {
    constructor() {
        this.piece = {};
        this.bindActions(PieceActions);
    }

    onUpdatePiece(piece) {
        this.piece = piece;
    }
}

export default alt.createStore(PieceStore, 'PieceStore');
