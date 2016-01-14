'use strict';

import { alt } from '../alt';

import PieceActions from '../actions/piece_actions';

import PieceSource from '../sources/piece_source';


class PieceStore {
    constructor() {
        this.getInitialState();

        this.bindActions(PieceActions);
        this.registerAsync(PieceSource);
        this.exportPublicMethods({
            getInitialState: this.getInitialState.bind(this)
        });
    }

    getInitialState() {
        this.piece = {};
        this.pieceMeta = {
            err: null,
            idToFetch: null
        };

        return {
            piece: this.piece,
            pieceMeta: this.pieceMeta
        }
    }

    onFetchPiece(idToFetch) {
        this.pieceMeta.idToFetch = idToFetch;

        this.getInstance.lookupPiece();
    }

    onSuccessFetchPiece({ piece }) {
        if (piece) {
            this.onUpdatePiece(piece);
        } else {
            this.pieceMeta.err = new Error('Problem fetching the piece');
        }
    }

    onErrorPiece(err) {
        this.pieceMeta.err = err;
    }

    onFlushPiece() {
        this.getInitialState();
    }

    onUpdatePiece(piece) {
        this.piece = piece;
        this.pieceMeta.err = null;
        this.pieceMeta.idToFetch = null;
    }

    onUpdateProperty({ key, value }) {
        if(this.piece && key in this.piece) {
            this.piece[key] = value;
        } else {
            throw new Error('There is no piece defined in PieceStore or the piece object does not have the property you\'re looking for.');
        }
    }
}

export default alt.createStore(PieceStore, 'PieceStore');
