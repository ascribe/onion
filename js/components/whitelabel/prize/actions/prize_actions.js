'use strict';

import { alt } from '../../../../alt';
import Q from 'q';

import PrizeFetcher from '../fetchers/prize_fetcher';

class PrizeActions {
    constructor() {
        this.generateActions(
            'updatePrize'
        );
    }

    fetchPrize() {
        return Q.Promise((resolve, reject) => {
            PrizeFetcher
                .fetch()
                .then((res) => {
                    this.actions.updatePrize({
                        prize: res.prize
                    });
                    resolve(res);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }
}

export default alt.createActions(PrizeActions);