'use strict';

import alt from '../alt';
import LoanContractListActions from '../actions/loan_contract_list_actions';


class LoanContractListStore {
    constructor() {
        this.contractList = [];
        this.bindActions(LoanContractListActions);
    }

    onUpdateLoanContractList(contractList) {
        this.contractList = contractList;
    }

    onFlushLoanContractList() {
        this.contractList = [];
    }
}

export default alt.createStore(LoanContractListStore, 'LoanContractListStore');
