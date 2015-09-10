'use strict';

import alt from '../alt';
import Q from 'q';

import OwnershipFetcher from '../fetchers/ownership_fetcher';


class ContractAgreementListActions {
    constructor() {
        this.generateActions(
            'updateContractAgreementList',
            'flushContractAgreementList'
        );
    }

    fetchContractAgreementList(issuer, accepted, pending) {
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.fetchContractAgreementList(issuer, accepted, pending)
                .then((contractAgreementList) => {
                    if (contractAgreementList.count > 0) {
                        this.actions.updateContractAgreementList(contractAgreementList.results);
                    }
                    else {
                        this.actions.updateContractAgreementList(null);
                    }
                    resolve();
                })
                .catch((err) => {
                    console.logGlobal(err);
                    this.actions.updateContractAgreementList(null);
                    reject(err);
                });
            }
        );
    }

}

export default alt.createActions(ContractAgreementListActions);
