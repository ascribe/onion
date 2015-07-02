'use strict';

import alt from '../alt';

import PieceListFetcher from '../fetchers/piece_list_fetcher';


class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList',
            'updatePieceListRequestActions'
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
                });
        });
    }
    fetchPieceRequestActions() {
        PieceListFetcher
            .fetchRequestActions()
            .then((res) => {
                this.actions.updatePieceListRequestActions(res.piece_ids);
            });
    }

}

export default alt.createActions(PieceListActions);
