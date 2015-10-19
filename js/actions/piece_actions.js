'use strict';

import { alt } from '../alt';
import PieceFetcher from '../fetchers/piece_fetcher';


class PieceActions {
    constructor() {
        this.generateActions(
            'updatePiece',
            'updateProperty',
            'pieceFailed'
        );
    }

    fetchOne(pieceId) {
        PieceFetcher.fetchOne(pieceId)
            .then((res) => {
                this.actions.updatePiece(res.piece);
            })
            .catch((err) => {
                this.actions.pieceFailed(err.json);
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(PieceActions);
