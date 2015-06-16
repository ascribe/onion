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

    onUpdateEditionList({pieceId, editionListOfPiece, orderBy, orderAsc}) {
        if(this.editionList[pieceId]) {
            this.editionList[pieceId].forEach((edition, i) => {
                // This uses the index of the new editionList for determining the edition.
                // If the list of editions can be sorted in the future, this needs to be changed!
                if (editionListOfPiece[i]) {
                    editionListOfPiece[i] = React.addons.update(edition, {$merge: editionListOfPiece[i]});
                }
            });
        }

        this.editionList[pieceId] = editionListOfPiece;

        /**
         * orderBy and orderAsc are specific to a single list of editions
         * therefore they need to be saved in relation to their parent-piece.
         *
         * Default values for both are set in the editon_list-actions.
         */
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