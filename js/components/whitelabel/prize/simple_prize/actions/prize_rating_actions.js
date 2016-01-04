'use strict';

import { alt } from '../../../../../alt';
import Q from 'q';

import PrizeRatingFetcher from '../fetchers/prize_rating_fetcher';

class PrizeRatingActions {
    constructor() {
        this.generateActions(
            'updatePrizeRatings',
            'updatePrizeRatingAverage',
            'updatePrizeRating',
            'resetPrizeRatings'
        );
    }

    fetchAverage(pieceId, round) {
        return Q.Promise((resolve, reject) => {
            PrizeRatingFetcher
                .fetchAverage(pieceId, round)
                .then((res) => {
                    this.actions.updatePrizeRatingAverage(res.data);
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }

    fetchOne(pieceId, round) {
        return Q.Promise((resolve, reject) => {
            PrizeRatingFetcher
                .fetchOne(pieceId, round)
                .then((res) => {
                    this.actions.updatePrizeRating(res.rating.rating);
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    createRating(pieceId, rating, round) {
        return Q.Promise((resolve, reject) => {
            PrizeRatingFetcher
                .rate(pieceId, rating, round)
                .then((res) => {
                    this.actions.updatePrizeRating(res.rating.rating);
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    toggleShortlist(pieceId) {
        return Q.Promise((resolve, reject) => {
            PrizeRatingFetcher
                .select(pieceId)
                .then((res) => {
                    this.actions.updatePrizeRatings(res.data.ratings);
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default alt.createActions(PrizeRatingActions);
