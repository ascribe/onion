'use strict';

import request from '../utils/request';

import { getCurrentSubdomain } from '../utils/url';


let LicenseFetcher = {
    /**
     * Fetch the available licenses from the API (might be bound to the subdomain e.g. cc.ascribe.io).
     */
    fetch() {
        const query = {
            subdomain: getCurrentSubdomain()
        };

        return request('licenses', { query });
    }
};

export default LicenseFetcher;
