'use strict';

import { altWhitelabel } from '../alt';
import WhitelabelActions from '../actions/whitelabel_actions';
import WhitelabelSource from '../sources/whitelabel_source';


class WhitelabelStore {
    constructor() {
        this.whitelabel = {};
        this.whitelabelMeta = {
            invalidateCache: false,
            err: null
        };

        this.bindActions(WhitelabelActions);
        this.registerAsync(WhitelabelSource);
    }

    onFetchWhitelabel(invalidateCache) {
        this.whitelabelMeta.invalidateCache = invalidateCache;

        if(!this.getInstance().isLoading()) {
            this.getInstance().lookupWhitelabel();
        }
    }

    onSuccessFetchWhitelabel(whitelabel) {
        this.whitelabelMeta.invalidateCache = false;
        this.whitelabel = whitelabel;
    }

    onWhitelabelFailed(err) {
        console.logGlobal(err);
        this.whitelabelMeta.err = err;
    }
}

export default altWhitelabel.createStore(WhitelabelStore, 'WhitelabelStore');
