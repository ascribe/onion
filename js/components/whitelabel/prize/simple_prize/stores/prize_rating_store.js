'use strict';

import { alt } from '../../../../../alt';

import PrizeRatingActions from '../actions/prize_rating_actions';

class PrizeRatingStore {
    constructor() {
        this.getInitialState();

        this.bindActions(PrizeRatingActions);
        this.exportPublicMethods({
            getInitialState: this.getInitialState.bind(this)
        });
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

    onResetPrizeRatings() {
        this.getInitialState();
    }

    getInitialState() {
        this.ratings = [];
        this.currentRating = null;
        this.average = null;

        return {
            ratings: this.ratings,
            currentRating: this.currentRating,
            average: this.average
        };
    }
}

export default alt.createStore(PrizeRatingStore, 'PrizeRatingStore');