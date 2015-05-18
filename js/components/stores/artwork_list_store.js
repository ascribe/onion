import alt from '../alt';

class ArtworkListStore {
	constructor() {
		this.artworkList = [];
	}
};

export default alt.createStore(ArtworkListStore);