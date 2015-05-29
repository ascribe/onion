import React from 'react';

import alt from '../alt';
import EditionsListActions from '../actions/edition_list_actions';

class EditionListStore {
    constructor() {
        this.editionList = {};
        this.bindActions(EditionsListActions);
    }

    onUpdateEditionList({pieceId, editionListOfPiece}) {
        if(this.editionList[pieceId]) {
            this.editionList[pieceId].forEach((edition, i) => {
                // This uses the index of the new editionList for determining the edition.
                // If the list of editions can be sorted in the future, this needs to be changed!
                editionListOfPiece[i] = React.addons.update(edition, {$merge: editionListOfPiece[i]});
            })
        }
        this.editionList[pieceId] = editionListOfPiece;
    }

    onSelectEdition({pieceId, editionId}) {

        this.editionList[pieceId].forEach((edition) => {
            if(edition.edition_number === editionId) {
                if(edition.selected) {
                    edition.selected = false;
                } else {
                    edition.selected = true;
                }
            }
        });

    }
};

export default alt.createStore(EditionListStore);