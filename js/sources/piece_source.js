'use strict';

import request from '../utils/request';

import PieceActions from '../actions/piece_actions';


const PieceSource = {
    lookupPiece: {
        remote(state, pieceId) {
            return request('piece', {
                urlTemplateSpec: { pieceId }
            });
        },

        success: PieceActions.successFetchPiece,
        error: PieceActions.errorPiece
    }
};

export default PieceSource;
