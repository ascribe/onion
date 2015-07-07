'use strict';

import React from 'react';
import alt from '../alt';

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
        this.pieceListCount = -1;
        this.page = 1;
        this.pageSize = 10;
        this.search = '';
        this.orderBy = 'artist_name';
        this.orderAsc = true;
        this.bindActions(PieceListActions);
    }

    /*onShowEditionList(pieceId) {
        this.pieceList
            .forEach((piece) => {
                if(piece.id === pieceId) {
                    if(piece.show) {
                        piece.show = false;
                    } else {
                        piece.show = true;
                    }
                }
            });
    }*/

    /*onCloseAllEditionLists() {
        this.pieceList
            .forEach((piece) => {
                piece.show = false;
            });
    }*/
    
    onUpdatePieceList({ page, pageSize, search, pieceList, orderBy, orderAsc, pieceListCount }) {
        this.page = page;
        this.pageSize = pageSize;
        this.search = search;
        this.orderAsc = orderAsc;
        this.orderBy = orderBy;
        this.pieceListCount = pieceListCount;

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
            let oldPiece = this.pieceList[i];
            if(oldPiece) {
                piece = React.addons.update(piece, {
                    show: { $set: oldPiece.show }
                });
            }
            
        });

        this.pieceList = pieceList;
    }
    onUpdatePieceListRequestActions(requestActions) {
        this.pieceList.forEach((piece) => {
            piece.requestAction = requestActions.indexOf(piece.id) > -1;
        });
    }
}

export default alt.createStore(PieceListStore, 'PieceListStore');
