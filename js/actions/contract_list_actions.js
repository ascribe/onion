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


    changeContract(contract){
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.makeContractPublic(contract)
                .then((res) => {
                    resolve(res);
                })
                .catch((err)=> {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }

    removeContract(contractId){
        return Q.Promise( (resolve, reject) => {
            OwnershipFetcher.deleteContract(contractId)
                .then((res) => {
                    resolve(res);
                })
                .catch( (err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }
}

export default alt.createActions(ContractListActions);
