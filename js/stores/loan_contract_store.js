'use strict';

import alt from '../alt';
import LoanContractActions from '../actions/loan_contract_actions';


class LoanContractStore {
    constructor() {
        this.contractKey = null;
        this.contractUrl = null;
        this.contractEmail = null;
        this.bindActions(LoanContractActions);
    }

    onUpdateLoanContract({contractKey, contractUrl, contractEmail}) {
        this.contractKey = contractKey;
        this.contractUrl = contractUrl;
        this.contractEmail = contractEmail;
    }

    onFlushLoanContract() {
        this.contractKey = null;
        this.contractUrl = null;
        this.contractEmail = null;
    }
}

export default alt.createStore(LoanContractStore, 'LoanContractStore');
