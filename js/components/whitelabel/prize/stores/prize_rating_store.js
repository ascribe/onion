'use strict';

import alt from '../../../../alt';

import PrizeRatingActions from '../actions/prize_rating_actions';

class PrizeRatingStore {
    constructor() {
        this.ratings = [];
        this.currentRating = null;
        this.average = null;
        this.bindActions(PrizeRatingActions);
    }

    onUpdatePrizeRatings(ratings) {
        this.ratings = ratings;
    }

    onUpdatePrizeRating(rating) {
        this.currentRating = parseInt(rating, 10);
    }

    onUpdatePrizeRatingAverage(data) {
        this.average = data.average;
        this.ratings = data.ratings;
    }
}

export default alt.createStore(PrizeRatingStore, 'PrizeRatingStore');