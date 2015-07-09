'use strict';

import alt from '../alt';

import PieceListFetcher from '../fetchers/piece_list_fetcher';

class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList',
            'updatePieceListRequestActions',
            'addFirstEditionToPiece'
        );
    }

    fetchPieceList(page, pageSize, search, orderBy, orderAsc) {
        return new Promise((resolve, reject) => {
            PieceListFetcher
                .fetch(page, pageSize, search, orderBy, orderAsc)
                .then((res) => {
                    this.actions.updatePieceList({
                        page,
                        pageSize,
                        search,
                        orderBy,
                        orderAsc,
                        'pieceList': res.pieces,
                        'pieceListCount': res.count
                    });
                    resolve();
                })
                .catch((err) => reject(err));
        });
    }

    fetchPieceRequestActions() {
        PieceListFetcher
            .fetchRequestActions()
            .then((res) => {
                this.actions.updatePieceListRequestActions(res.piece_ids);
            });
    }

    fetchFirstEditionForPiece(pieceId) {
        return new Promise((resolve, reject) => {
            PieceListFetcher.fetchFirstEditionForPiece(pieceId)
                .then((firstEdition) => {
                    this.actions.addFirstEditionToPiece({pieceId, firstEdition});
                    resolve();
                })
                .catch((err) => reject(err));
        });
    }
}

export default alt.createActions(PieceListActions);
