'use strict';

import alt from '../alt';
import Q from 'q';

import OwnershipFetcher from '../fetchers/ownership_fetcher';
import ContractListActions from './contract_list_actions';

class ContractAgreementListActions {
    constructor() {
        this.generateActions(
            'updateContractAgreementList',
            'flushContractAgreementList'
        );
    }

    fetchContractAgreementList(issuer, accepted, pending) {
        this.actions.updateContractAgreementList(null);
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.fetchContractAgreementList(issuer, accepted, pending)
                .then((contractAgreementList) => {
                    if (contractAgreementList.count > 0) {
                        this.actions.updateContractAgreementList(contractAgreementList.results);
                        resolve(contractAgreementList.results);
                    }
                    else{
                        resolve(null);
                    }
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
            }
        );
    }

    fetchAvailableContractAgreementList(issuer, createContractAgreement) {
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.fetchContractAgreementList(issuer, true, null)
                .then((acceptedContractAgreementList) => {
                    // if there is at least an accepted contract agreement, we're going to
                    // use it
                    if(acceptedContractAgreementList.count > 0) {
                        this.actions.updateContractAgreementList(acceptedContractAgreementList.results);
                    } else {
                        // otherwise, we're looking for contract agreements that are still pending
                        //
                        // Normally nesting promises, but for this conditional one, it makes sense to not
                        // overcomplicate the method
                        OwnershipFetcher.fetchContractAgreementList(issuer, null, true)
                            .then((pendingContractAgreementList) => {
                                if(pendingContractAgreementList.count > 0) {
                                    this.actions.updateContractAgreementList(pendingContractAgreementList.results);
                                } else {
                                    // if there was neither a pending nor an active contractAgreement
                                    // found and createContractAgreement is set to true, we create a
                                    // new contract agreement
                                    if(createContractAgreement) {
                                        this.actions.createContractAgreementFromPublicContract(issuer);
                                    }
                                }
                            })
                            .catch((err) => {
                                console.logGlobal(err);
                                reject(err);
                            });
                    }
                })
                .catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
            }
        );
    }

    createContractAgreementFromPublicContract(issuer) {
        ContractListActions.fetchContractList(null, null, issuer)
            .then((publicContract) => {
                // create an agreement with the public contract if there is one
                if (publicContract && publicContract.length > 0) {
                    return this.actions.createContractAgreement(null, publicContract[0]);
                }
                else {
                    /*
                    contractAgreementList in the store is already set to null;
                     */
                }
            }).then((publicContracAgreement) => {
                if (publicContracAgreement) {
                    this.actions.updateContractAgreementList([publicContracAgreement]);
                }
            }).catch((err) => {
                console.logGlobal(err);
            });
    }

    createContractAgreement(issuer, contract){
        return Q.Promise((resolve, reject) => {
            OwnershipFetcher.createContractAgreement(issuer, contract).then(
                (contractAgreement) => {
                    resolve(contractAgreement);
                }
            ).catch((err) => {
                console.logGlobal(err);
                reject(err);
            });
        });
    }
}

export default alt.createActions(ContractAgreementListActions);
