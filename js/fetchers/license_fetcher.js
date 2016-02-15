'use strict';

import requests from '../utils/requests';

import { getSubdomain } from '../utils/url_utils';


let LicenseFetcher = {
    /**
     * Fetch the available licenses from the API (might be bound to the subdomain e.g. cc.ascribe.io).
     */
    fetch() {
        return requests.get('licenses', {'subdomain': getSubdomain()});
    }
};

export default LicenseFetcher;
