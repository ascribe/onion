'use strict';

import alt from '../alt';
import WhitelabelActions from '../actions/whitelabel_actions';


class WhitelabelStore {
    constructor() {
        this.whitelabel = {};
        this.bindActions(WhitelabelActions);
    }

    onUpdateWhitelabel(whitelabel) {
        this.whitelabel = whitelabel;
    }
}

export default alt.createStore(WhitelabelStore, 'WhitelabelStore');
