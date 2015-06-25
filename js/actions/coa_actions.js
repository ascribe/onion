'use strict';

import alt from '../alt';
import CoaFetcher from '../fetchers/coa_fetcher';


class CoaActions {
    constructor() {
        this.generateActions(
            'updateCoa'
        );
    }

    fetchOne(id) {
        CoaFetcher.fetchOne(id)
            .then((res) => {
                this.actions.updateCoa(res.coa);
                console.log(res.coa);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    create(edition) {
        CoaFetcher.create(edition.bitcoin_id)
            .then((res) => {
                this.actions.updateCoa(res.coa);
                console.log(res.coa);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default alt.createActions(CoaActions);
