'use strict';

import alt from '../alt';
import Q from 'q';

import PrizeListFetcher from '../fetchers/prize_list_fetcher';

class PrizeListActions {
    constructor() {
        this.generateActions(
            'updatePrizeList'
        );
    }

    fetchPrizeList() {
        return Q.Promise((resolve, reject) => {
            PrizeListFetcher
                .fetch()
                .then((res) => {
                    this.actions.updatePrizeList({
                        prizeList: res.prizes,
                        prizeListCount: res.count
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

export default alt.createActions(PrizeListActions);