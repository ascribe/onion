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
                this.actions.updateContractList(contracts.results);
            })
            .catch((err) => {
                console.logGlobal(err);
                this.actions.updateContractList([]);
            });
    }

    makeContractPublic(contract){
        OwnershipFetcher.makeContractPublic(contract)
            .then((res) =>{
                return res;
            })
            .catch((err)=>{
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(ContractListActions);
