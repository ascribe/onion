import alt from '../alt';

class ArtworkListActions {
  constructor() {
    this.generateActions(
      'updateArtworks'
    );
  };
};

export default alt.createAction(ArtworkListActions);