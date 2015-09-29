'use strict';

import alt from '../alt';
import ContractListActions from '../actions/contract_list_actions';


class ContractListStore {
    constructor() {
        this.contractList = [];
        this.bindActions(ContractListActions);
    }

    onUpdateContractList(contractList) {
        this.contractList = contractList;
    }

    onFlushContractList() {
        this.contractList = [];
    }
}

export default alt.createStore(ContractListStore, 'ContractListStore');
