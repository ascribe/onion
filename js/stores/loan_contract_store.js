'use strict';

import alt from '../alt';
import LoanContractActions from '../actions/loan_contract_actions';


class LoanContractStore {
    constructor() {
        this.contractKey = null;
        this.contractUrl = null;
        this.bindActions(LoanContractActions);
    }

    onUpdateLoanContract({contractKey, contractUrl}) {
        this.contractKey = contractKey;
        this.contractUrl = contractUrl;
    }
}

export default alt.createStore(LoanContractStore, 'LoanContractStore');
