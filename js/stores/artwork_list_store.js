import alt from '../alt';
import ArtworkListActions from '../actions/artwork_list_actions';

class ArtworkListStore {
    constructor() {
        this.artworkList = [];
        this.bindActions(ArtworkListActions);
    }

    onUpdateArtworkList(artworkList) {
        this.artworkList = artworkList;
    }
};

export default alt.createStore(ArtworkListStore);
