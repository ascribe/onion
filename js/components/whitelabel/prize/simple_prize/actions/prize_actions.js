'use strict';

import { alt } from '../../../../../alt';

import PrizeFetcher from '../fetchers/prize_fetcher';

class PrizeActions {
    constructor() {
        this.generateActions(
            'updatePrize'
        );
    }

    fetchPrize() {
        PrizeFetcher
            .fetch()
            .then((res) => {
                this.actions.updatePrize({
                    prize: res
                });
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(PrizeActions);