'use strict';

import { altWhitelabel } from '../alt';

import WhitelabelActions from '../actions/whitelabel_actions';

import WhitelabelSource from '../sources/whitelabel_source';


class WhitelabelStore {
    constructor() {
        this.whitelabel = {};
        this.whitelabelMeta = {
            err: null
        };

        this.bindActions(WhitelabelActions);
        this.registerAsync(WhitelabelSource);
    }

    onFetchWhitelabel(invalidateCache) {
        if (invalidateCache || !this.getInstance().isLoading()) {
            this.getInstance().lookupWhitelabel(invalidateCache);
        }
    }

    onSuccessFetchWhitelabel({ whitelabel = {} }) {
        this.whitelabelMeta.err = null;
        this.whitelabel = whitelabel;
    }

    onErrorCurrentUser(err) {
        console.logGlobal(err);
        this.whitelabelMeta.err = err;
    }
}

export default altWhitelabel.createStore(WhitelabelStore, 'WhitelabelStore');
