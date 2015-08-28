'use strict';

import alt from '../alt';
import ContractActions from '../actions/contract_actions';


class ContractStore {
    constructor() {
        this.contractKey = null;
        this.contractUrl = null;
        this.contractEmail = null;
        this.bindActions(ContractActions);
    }

    onUpdateContract({contractKey, contractUrl, contractEmail}) {
        this.contractKey = contractKey;
        this.contractUrl = contractUrl;
        this.contractEmail = contractEmail;
    }

    onFlushContract() {
        this.contractKey = null;
        this.contractUrl = null;
        this.contractEmail = null;
    }
}

export default alt.createStore(ContractStore, 'ContractStore');
