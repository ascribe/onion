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
        if(this.editionList[pieceId]) {

            let pageOfCurrentEditionList = this.editionList[pieceId].slice((page - 1) * pageSize, pageSize);
            
            if(pageOfCurrentEditionList.length < 1) {
                // just append newly received editions
                console.log('asdasd');
                this.editionList[pieceId].push.apply(this.editionList[pieceId], editionListOfPiece);
            } else {
                // merge with existing page's editions
                pageOfCurrentEditionList.forEach((edition, i) => {

                    if(editionListOfPiece[i]) {
                        edition = React.addons.update(edition, {$merge: editionListOfPiece[i]});
                    }

                    this.editionList[pieceId].splice((page - 1) * pageSize + i, 0, edition);
                });
            }
        } else {
            this.editionList[pieceId] = editionListOfPiece;
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
