'use strict';

import requests from '../utils/requests';

import PieceActions from '../actions/piece_actions';


const PieceSource = {
    lookupPiece: {
        remote(state, pieceId) {
            return requests.get('piece', { piece_id: pieceId });
        },

        success: PieceActions.successFetchPiece,
        error: PieceActions.errorPiece
    }
};

export default PieceSource;
