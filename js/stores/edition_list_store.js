import alt from '../alt';
import EditionsListActions from '../actions/edition_list_actions';

class EditionListStore {
    constructor() {
        this.editionList = {};
        this.bindActions(EditionsListActions);
    }

    onUpdateEditionList({pieceId, editionListOfPiece}) {
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