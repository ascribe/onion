'use strict';

import requests from '../utils/requests';
import WhitelabelActions from '../actions/whitelabel_actions';

import { getSubdomain } from '../utils/general';


const WhitelabelSource = {
    lookupWhitelabel: {
        remote() {
            return requests.get('whitelabel_settings', { 'subdomain': getSubdomain() });
        },

        local(state) {
            return Object.keys(state.whitelabel).length ? state : {};
        },

        success: WhitelabelActions.successFetchWhitelabel,
        error: WhitelabelActions.errorWhitelabel,

        shouldFetch(state, invalidateCache) {
            return invalidateCache || !Object.keys(state.whitelabel).length;
        }
    }
};

export default WhitelabelSource;
