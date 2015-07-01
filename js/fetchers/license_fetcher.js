'use strict';

import requests from '../utils/requests';

let LicenseFetcher = {
    /**
     * Fetch the available licenses from the API (might be bound to the subdomain e.g. cc.ascribe.io).
     */
    fetch() {
        return requests.get('licenses', {'subdomain': window.location.host.split('.')[0]});
    }
};

export default LicenseFetcher;
