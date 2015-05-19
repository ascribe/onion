import alt from '../alt';
import ArtworkFetcher from '../fetchers/artwork_fetcher';

class ArtworkListActions {
    constructor() {
        this.generateActions(
            'updateArtworkList'
        );
    }

    fetchArtworkList() {
        ArtworkFetcher.fetch().end((err, res) => {
            if (err) {
                console.error('OMG cannot retrieve the artworks');
            } else {
                this.actions.updateArtworkList(res.body['pieces']);
            }
        })
    }
};

export default alt.createActions(ArtworkListActions);
