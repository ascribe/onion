import alt from '../alt';

class ArtworkListActions {
    constructor() {
        this.generateActions(
            'updateArtworkList'
        );
    };
};

export default alt.createActions(ArtworkListActions);
