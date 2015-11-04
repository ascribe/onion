'use strict';

import requests from '../utils/requests';
import WhitelabelActions from '../actions/whitelabel_actions';

import { getSubdomain } from '../utils/general_utils';


const WhitelabelSource = {
    lookupWhitelabel: {
        remote() {
            return requests.get('whitelabel_settings', {'subdomain': getSubdomain()});
        },
        local(state) {
            return Object.keys(state.whitelabel).length > 0 ? state : {};
        },
        success: WhitelabelActions.successFetchWhitelabel,
        error: WhitelabelActions.whitelabelFailed,
        shouldFetch(state) {
            return state.whitelabelMeta.invalidateCache || Object.keys(state.whitelabel).length === 0;
        }
    }
};

export default WhitelabelSource;