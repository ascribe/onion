'use strict';

import alt from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';


class LoanContractListActions {
    constructor() {
        this.generateActions(
            'updateLoanContractList',
            'flushLoanContractList'
        );
    }

    fetchLoanContractList() {
        OwnershipFetcher.fetchLoanContractList()
            .then((contracts) => {
                this.actions.updateLoanContractList(contracts);
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.updateLoanContractList([]);
            });
    }
}

export default alt.createActions(LoanContractListActions);
