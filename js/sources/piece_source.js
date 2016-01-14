'use strict';

import requests from '../utils/requests';

import PieceActions from '../actions/edition_actions';


const PieceSource = {
    lookupPiece: {
        remote(state) {
            return requests.get('piece', { piece_id: state.pieceMeta.idToFetch });
        },

        success: PieceActions.successFetchPiece,
        error: PieceActions.errorPiece
    }
};

export default PieceSource;
