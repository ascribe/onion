'use strict';

import { alt } from '../../../../alt';
import Q from 'q';

import PrizeRatingFetcher from '../fetchers/prize_rating_fetcher';

class PrizeRatingActions {
    constructor() {
        this.generateActions(
            'updatePrizeRatings',
            'updatePrizeRatingAverage',
            'updatePrizeRating'
        );
    }

    fetchAverage(pieceId) {
        return Q.Promise((resolve, reject) => {
            PrizeRatingFetcher
                .fetchAverage(pieceId)
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

    fetchOne(pieceId) {
        return Q.Promise((resolve, reject) => {
            PrizeRatingFetcher
                .fetchOne(pieceId)
                .then((res) => {
                    this.actions.updatePrizeRating(res.rating.rating);
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    createRating(pieceId, rating) {
        return Q.Promise((resolve, reject) => {
            PrizeRatingFetcher
                .rate(pieceId, rating)
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

    updateRating(rating) {
        this.actions.updatePrizeRating(rating);
    }
}

export default alt.createActions(PrizeRatingActions);