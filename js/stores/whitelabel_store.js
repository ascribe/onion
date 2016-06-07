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

        // Prevent alt from sending an empty change event when a request is sent
        // off to the source
        this.preventDefault();
    }

    onSuccessFetchWhitelabel({ whitelabel = {} }) {
        this.whitelabelMeta.err = null;
        this.whitelabel = whitelabel;
    }

    onErrorWhitelabel(err) {
        console.logGlobal(err);
        this.whitelabelMeta.err = err;
    }
}

export default altWhitelabel.createStore(WhitelabelStore, 'WhitelabelStore');
