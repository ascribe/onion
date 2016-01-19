'use strict';

import { alt } from '../alt';
import OwnershipFetcher from '../fetchers/ownership_fetcher';
import Q from 'q';

class ContractListActions {
    constructor() {
        this.generateActions(
            'updateContractList',
            'flushContractList'
        );
    }

    fetchContractList(isActive, isPublic, issuer) {
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.fetchContractList(isActive, isPublic, issuer)
                .then((contracts) => {
                    this.actions.updateContractList(contracts.results);
                    resolve(contracts.results);
                })
                .catch((err) => {
                    console.logGlobal(err);
                    this.actions.updateContractList([]);
                    reject(err);
                });
        });
    }


    changeContract(contract) {
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.changeContract(contract)
                .then(resolve)
                .catch((err)=> {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }

    removeContract(contractId) {
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.deleteContract(contractId)
                .then(resolve)
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }
}

export default alt.createActions(ContractListActions);
