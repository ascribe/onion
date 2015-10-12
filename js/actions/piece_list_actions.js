'use strict';

import alt from '../alt';
import Q from 'q';

import PieceListFetcher from '../fetchers/piece_list_fetcher';


class PieceListActions {
    constructor() {
        this.generateActions(
            'updatePieceList',
            'updatePieceListRequestActions',
            'updatePropertyForPiece'
        );
    }

    fetchPieceList(page, pageSize, search, orderBy, orderAsc, filterBy) {
        // To prevent flickering on a pagination request,
        // we overwrite the piecelist with an empty list before
        // pieceListCount === -1 defines the loading state
        this.actions.updatePieceList({
            page,
            pageSize,
            orderBy,
            orderAsc,
            filterBy,
            search: '',
            pieceList: [],
            pieceListCount: -1,
            unfilteredPieceListCount: -1
        });

        // afterwards, we can load the list
        return Q.Promise((resolve, reject) => {
            PieceListFetcher
                .fetch(page, pageSize, search, orderBy, orderAsc, filterBy)
                .then((res) => {
                    this.actions.updatePieceList({
                        page,
                        pageSize,
                        search,
                        orderBy,
                        orderAsc,
                        filterBy,
                        pieceList: res.pieces,
                        pieceListCount: res.count,
                        unfilteredPieceListCount: res.unfiltered_count
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
                this.actions.updatePieceListRequestActions(res);
            })
            .catch((err) => console.logGlobal(err));
    }
}

export default alt.createActions(PieceListActions);
