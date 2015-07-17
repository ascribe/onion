'use strict';

import alt from '../alt';
import PieceFetcher from '../fetchers/piece_fetcher';


class PieceActions {
    constructor() {
        this.generateActions(
            'updatePiece',
            'updateProperty'
        );
    }

    fetchOne(pieceId) {
        PieceFetcher.fetchOne(pieceId)
            .then((res) => {
                this.actions.updatePiece(res.piece);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(PieceActions);
