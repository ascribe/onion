'use strict';

import requests from '../utils/requests';

let WhitelabelFetcher = {
    /**
     * Fetch the custom whitelabel data from the API.
     */
    fetch() {
        return requests.get('whitelabel_settings', {'subdomain': window.location.host.split('.')[0]});
    }
};

export default WhitelabelFetcher;
