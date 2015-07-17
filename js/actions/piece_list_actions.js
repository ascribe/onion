'use strict';

import alt from '../alt';

import PieceListFetcher from '../fetchers/piece_list_fetcher';

class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList',
            'updatePieceListRequestActions',
            'updatePropertyForPiece'
        );
    }

    fetchPieceList(page, pageSize, search, orderBy, orderAsc) {
        // To prevent flickering on a pagination request,
        // we overwrite the piecelist with an empty list before
        // pieceListCount === -1 defines the loading state
        this.actions.updatePieceList({
            page,
            pageSize,
            search,
            orderBy,
            orderAsc,
            'pieceList': [],
            'pieceListCount': -1
        });

        // afterwards, we can load the list

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
            })
            .catch((err) => console.logGlobal(err));
    }
}

export default alt.createActions(PieceListActions);
