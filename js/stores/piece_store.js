'use strict';

import { alt } from '../alt';
import PieceActions from '../actions/piece_actions';


class PieceStore {
    constructor() {
        this.piece = {};
        this.pieceError = null;
        this.bindActions(PieceActions);
    }

    onUpdatePiece(piece) {
        this.piece = piece;
        this.pieceError = null;
    }

    onUpdateProperty({key, value}) {
        if(this.piece && key in this.piece) {
            this.piece[key] = value;
        } else {
            throw new Error('There is no piece defined in PieceStore or the piece object does not have the property you\'re looking for.');
        }
    }

    onPieceFailed(err) {
        this.pieceError = err;
    }
}

export default alt.createStore(PieceStore, 'PieceStore');
