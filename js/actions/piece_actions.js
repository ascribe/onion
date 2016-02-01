'use strict';

import { alt } from '../alt';


class PieceActions {
    constructor() {
        this.generateActions(
            'fetchPiece',
            'successFetchPiece',
            'errorPiece',
            'flushPiece',
            'updatePiece',
            'updateProperty'
        );
    }
}

export default alt.createActions(PieceActions);
