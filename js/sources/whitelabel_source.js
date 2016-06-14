'use strict';

import request from '../utils/request';
import WhitelabelActions from '../actions/whitelabel_actions';

import { getCurrentSubdomain } from '../utils/url';


const WhitelabelSource = {
    lookupWhitelabel: {
        remote() {
            return request('whitelabel_settings', {
                urlTemplateSpec: {
                    subdomain: getCurrentSubdomain()
                }
            });
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
