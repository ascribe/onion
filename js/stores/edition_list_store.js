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

    onUpdateEditionList({pieceId, editionListOfPiece, page, pageSize, orderBy, orderAsc}) {
        

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
         * orderBy and orderAsc are specific to a single list of editions
         * therefore they need to be saved in relation to their parent-piece.
         *
         * Default values for both are set in the editon_list-actions.
         */
        this.editionList[pieceId].page = page;
        this.editionList[pieceId].pageSize = pageSize;
        this.editionList[pieceId].orderBy = orderBy;
        this.editionList[pieceId].orderAsc = orderAsc;
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
