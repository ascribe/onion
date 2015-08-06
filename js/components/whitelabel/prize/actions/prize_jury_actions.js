'use strict';

import alt from '../../../../alt';
import Q from 'q';

import PrizeJuryFetcher from '../fetchers/prize_jury_fetcher';

class PrizeJuryActions {
    constructor() {
        this.generateActions(
            'updatePrizeJury'
        );
    }

    fetchJury() {
        return Q.Promise((resolve, reject) => {
            PrizeJuryFetcher
                .fetch()
                .then((res) => {
                    this.actions.updatePrizeJury(res.members);
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }
}

export default alt.createActions(PrizeJuryActions);