'use strict';

import { altWhitelabel } from '../alt';
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

export default altWhitelabel.createStore(WhitelabelStore, 'WhitelabelStore');
