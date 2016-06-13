'use strict';

import requests from '../utils/requests';

import { getCurrentSubdomain } from '../utils/url';


let LicenseFetcher = {
    /**
     * Fetch the available licenses from the API (might be bound to the subdomain e.g. cc.ascribe.io).
     */
    fetch() {
        return requests.get('licenses', { 'subdomain': getCurrentSubdomain() });
    }
};

export default LicenseFetcher;
