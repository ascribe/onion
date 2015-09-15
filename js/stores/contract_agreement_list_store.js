'use strict';

import alt from '../alt';
import ContractAgreementListActions from '../actions/contract_agreement_list_actions';


class ContractAgreementListStore {
    constructor() {
        this.contractAgreementList = null;
        this.bindActions(ContractAgreementListActions);
    }

    onUpdateContractAgreementList(contractAgreementList) {
        this.contractAgreementList = contractAgreementList;
    }

    onFlushContractAgreementList() {
        this.contractAgreementList = null;
    }
}

export default alt.createStore(ContractAgreementListStore, 'ContractAgreementListStore');
