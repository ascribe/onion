'use strict';

import React from 'react';
import { alt } from '../alt';

import PieceListActions from '../actions/piece_list_actions';


class PieceListStore {
    constructor() {
        /**
         * The store manages the state that is introduced by fetching
         * the resource with certain parameters.
         *
         * This means that pieceList for example only contains pageSize-many items.
         * Of course this can be altered by page as well.
         *
         * This is also the reason why we store a pieceListCount, which is essentially
         * the number of items the resource actually - without pagination - provides.
         */
        this.pieceList = [];
        // -1 specifies that the store is currently loading
        this.pieceListCount = -1;
        this.unfilteredPieceListCount = -1;
        this.page = 1;
        this.pageSize = 20;
        this.search = '';
        this.orderBy = 'artist_name';
        this.orderAsc = true;
        this.filterBy = {};
        this.requestActions = {};
        this.bindActions(PieceListActions);
    }

    onUpdatePieceList({ page, pageSize, search, pieceList, orderBy, orderAsc, pieceListCount, unfilteredPieceListCount, filterBy }) {
        this.page = page;
        this.pageSize = pageSize;
        this.search = search;
        this.orderAsc = orderAsc;
        this.orderBy = orderBy;
        this.pieceListCount = pieceListCount;
        this.unfilteredPieceListCount = unfilteredPieceListCount;
        this.filterBy = filterBy;

        /**
         * Pagination - Known Issue:
         * #########################
         *
         *
         * The piece list store currently stores the open/close state of a piece list item.
         *
         * Once a new page is requested, this.pieceList will be overwritten, which means that the
         * open/close state of a specific list item will be thrown away.
         *
         * This means that when opening an editionListTable on a piece, and continuing
         * clicking next or back in the pagination, the editionListTable will return to its
         * default value, which is "close".
         *
         * We did not implement this, as we're going to add pagination to pieceList at some
         * point anyway. Then, this problem is automatically resolved.
         */
        pieceList.forEach((piece, i) => {
            const oldPiece = this.pieceList[i];
            if (oldPiece) {
                piece = React.addons.update(piece, {
                    show: { $set: oldPiece.show }
                });
            }

        });

        this.pieceList = pieceList;
    }

    onUpdatePieceListRequestActions(res) {
        this.requestActions = res.actions;
    }

    onUpdatePropertyForPiece({ pieceId, key, value }) {
        const filteredPieceList = this.pieceList.filter((piece) => piece.id === pieceId);

        if (filteredPieceList.length === 1) {
            const piece = filteredPieceList[0];
            piece[key] = value;
        } else {
            throw new Error('Could not find a matching piece in piece list since its either not there or piecelist contains duplicates.');
        }
    }
}

export default alt.createStore(PieceListStore, 'PieceListStore');
