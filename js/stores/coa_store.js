'use strict';

import alt from '../alt';
import CoaActions from '../actions/coa_actions';


class CoaStore {
    constructor() {
        this.coa = {};
        this.bindActions(CoaActions);
    }

    onUpdateCoa(coa) {
        this.coa = coa;
    }
}

export default alt.createStore(CoaStore, 'CoaStore');
