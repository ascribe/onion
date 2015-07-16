'use strict';

import React from 'react';

import alt from '../alt';
import EditionsListActions from '../actions/edition_list_actions';

class EditionListStore {
    constructor() {
        this.editionList = {};
        this.isEditionListOpenForPieceId = {};
        this.bindActions(EditionsListActions);
    }

    onUpdateEditionList({pieceId, editionListOfPiece, page, pageSize, orderBy, orderAsc, count}) {
        
        /*
            Basically there are two modes an edition list can be updated.

                1. The elements that have been requested from the server are not yet defined in the store => just assign them
                2. The elements are already defined => merge current objects with the new ones from the server

         */
        for(let i = 0; i < editionListOfPiece.length; i++) {

            // if editionList for a specific piece does not exist yet,
            // just initialize a new array
            if(!this.editionList[pieceId]) {
                this.editionList[pieceId] = [];
            }

            // this is the index formula for accessing an edition of a specific
            // page
            let storeEditionIndex = (page - 1) * pageSize + i;
            let editionsForPieces = this.editionList[pieceId];
            
            // if edition already exists, just merge
            if(editionsForPieces[storeEditionIndex]) {
                editionsForPieces[storeEditionIndex] = React.addons.update(editionsForPieces[storeEditionIndex], {$merge: editionListOfPiece[i]});
            } else {
                // if does not exist, assign
                editionsForPieces[storeEditionIndex] = editionListOfPiece[i];
            }
        }

        /**
         * page, pageSize, orderBy, orderAsc and count are specific to a single list of editions
         * therefore they need to be saved in relation to their parent-piece.
         *
         * Default values for both are set in the editon_list_actions.
         */
        this.editionList[pieceId].page = page;
        this.editionList[pieceId].pageSize = pageSize;
        this.editionList[pieceId].orderBy = orderBy;
        this.editionList[pieceId].orderAsc = orderAsc;
        this.editionList[pieceId].count = count;
    }

    /**
     * We often just have to refresh the edition list for a certain pieceId,
     * this method provides exactly that functionality without any side effects
     */
    onRefreshEditionList(pieceId) {

        // It may happen that the user enters the site logged in already
        // through /editions
        // If he then tries to delete a piece/edition and this method is called,
        // we'll not be able to refresh his edition list since its not yet there.
        // Therefore we can just return, since there is no data to be refreshed
        if(!this.editionList[pieceId]) {
            return;
        }

        const prevEditionListLength = this.editionList[pieceId].length;
        const prevEditionListPage = this.editionList[pieceId].page;
        const prevEditionListPageSize = this.editionList[pieceId].pageSize;

        // to clear an array, david walsh recommends to just set it's length to zero
        // http://davidwalsh.name/empty-array
        this.editionList[pieceId].length = 0;



        // refetch editions with adjusted page size
        EditionsListActions.fetchEditionList(pieceId, 1, prevEditionListLength, this.editionList[pieceId].orderBy, this.editionList[pieceId].orderAsc)
            .then(() => {
                // reset back to the normal pageSize and page
                this.editionList[pieceId].page = prevEditionListPage;
                this.editionList[pieceId].pageSize = prevEditionListPageSize;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    onSelectEdition({pieceId, editionId, toValue}) {
        this.editionList[pieceId].forEach((edition) => {

            // Taken from: http://stackoverflow.com/a/519157/1263876
            if(typeof toValue !== 'undefined' && edition.id === editionId) {
                edition.selected = toValue;
            } else if(edition.id === editionId) {
                if(edition.selected) {
                    edition.selected = false;
                } else {
                    edition.selected = true;
                }
            }
        });
    }

    onClearAllEditionSelections() {
        Object
            .keys(this.editionList)
            .forEach((pieceId) => {
                this.editionList[pieceId]
                    .forEach((edition) => {
                        try {
                            delete edition.selected;
                        } catch(err) {/* ignore and keep going */}
                    });
            });
    }

    onToggleEditionList(pieceId) {
        this.isEditionListOpenForPieceId[pieceId] = {
            show: this.isEditionListOpenForPieceId[pieceId] ? !this.isEditionListOpenForPieceId[pieceId].show : true
        };
    }

    onCloseAllEditionLists() {
        this.isEditionListOpenForPieceId = {};
    }
}

export default alt.createStore(EditionListStore, 'EditionListStore');
