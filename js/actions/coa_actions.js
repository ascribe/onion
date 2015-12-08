'use strict';

import { alt } from '../alt';
import CoaFetcher from '../fetchers/coa_fetcher';

import Q from 'q';

class CoaActions {
    constructor() {
        this.generateActions(
            'updateCoa',
            'flushCoa'
        );
    }

    fetchOrCreate(id, bitcoinId) {
        //return Q.Promise((resolve, reject) => {
            CoaFetcher.fetchOne(id)
                .then((res) => {
                    if (res.coa) {
                        this.actions.updateCoa(res.coa);
                    //resolve(res.coa);
                    }
                    else {
                        this.actions.create(bitcoinId).defer();
                    }
                })
                .catch((err) => {
                    console.logGlobal(err);
                    this.actions.updateCoa(null);
                    //reject(err);
                });
        //});
    }

    create(bitcoinId) {
        //return Q.Promise((resolve, reject) => {
            CoaFetcher.create(bitcoinId)
                .then((res) => {
                    this.actions.updateCoa(res.coa);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    this.actions.updateCoa(null);
                    //reject(err);
                });
        //});
    }
}

export default alt.createActions(CoaActions);
