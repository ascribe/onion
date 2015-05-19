import alt from '../alt';
import ArtworkFetcher from '../fetchers/artwork_fetcher';

class ArtworkListActions {
    constructor() {
        this.generateActions(
            'updateArtworkList'
        );
    }

    fetchArtworkList() {
        ArtworkFetcher.fetch()
            .then((res) => {
                this.actions.updateArtworkList(res.pieces);
            })
            .catch((err) => {
                console.log(err);           
            });
    }
};

export default alt.createActions(ArtworkListActions);
