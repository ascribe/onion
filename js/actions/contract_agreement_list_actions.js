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
        return Q.Promise((resolve, reject) => {
            this.actions.updateContractAgreementList(null);
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

    fetchAvailableContractAgreementList(issuer){
        return Q.Promise((resolve, reject) => {
            this.actions.fetchContractAgreementList(issuer, true, null)
                .then((contractAgreementListAccepted) => {
                    if (!contractAgreementListAccepted) {
                        // fetch pending agreements if no accepted ones
                        return this.actions.fetchContractAgreementList(issuer, null, true);
                    }
                    else {
                        resolve(contractAgreementListAccepted);
                    }
                }).then((contractAgreementListPending) => {
                    resolve(contractAgreementListPending);
                }).catch((err) => {
                    console.logGlobal(err);
                    reject(err);
                });
        });
    }

    createContractAgreementFromPublicContract(issuer){
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

    flushContractAgreementList(){
        return Q.Promise((resolve, reject) => {
            this.actions.updateContractAgreementList(null).then(
                resolve()
            ).catch((err) => {
                console.logGlobal(err);
                reject(err);
            });
        });
    }

}

export default alt.createActions(ContractAgreementListActions);
