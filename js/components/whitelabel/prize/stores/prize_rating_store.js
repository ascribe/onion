'use strict';

import alt from '../../../../alt';

import PrizeRatingActions from '../actions/prize_rating_actions';

class PrizeRatingStore {
    constructor() {
        this.ratings = [];
        this.currentRating = null;
        this.bindActions(PrizeRatingActions);
    }

    onUpdatePrizeRatings( ratings ) {
        this.ratings = ratings;
    }

    onUpdatePrizeRating( rating ) {
        this.currentRating = parseInt(rating, 10);
    }
}

export default alt.createStore(PrizeRatingStore, 'PrizeRatingStore');