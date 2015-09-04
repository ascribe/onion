'use strict';

import alt from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';
import Q from 'q';

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
        contract.public = true;
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.makeContractPublic(contract)
                .then((res) => {
                    console.log('Here is the result... ');
                    resolve(res);
                })
                .catch((err)=> {
                    console.log('Here we have an error');
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }
}

export default alt.createActions(ContractListActions);
