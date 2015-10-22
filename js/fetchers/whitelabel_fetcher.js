'use strict';

import requests from '../utils/requests';

import { getSubdomain } from '../utils/general_utils';


let WhitelabelFetcher = {
    /**
     * Fetch the custom whitelabel data from the API.
     */
    fetch() {
        return requests.get('whitelabel_settings', {'subdomain': getSubdomain()});
    }
};

export default WhitelabelFetcher;
