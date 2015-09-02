'use strict';

import alt from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';


class ContractListActions {
    constructor() {
        this.generateActions(
            'updateContractList',
            'flushContractList'
        );
    }

    fetchContractList() {
        OwnershipFetcher.fetchContractList()
            .then((contracts) => {
                this.actions.updateContractList(contracts);
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.updateContractList([]);
            });
    }
}

export default alt.createActions(ContractListActions);
