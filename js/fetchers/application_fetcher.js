'use strict';

import requests from '../utils/requests';

let ApplicationFetcher = {
    /**
     * Fetch the registered applications of a user from the API.
     */
    fetch() {
        return requests.get('applications');
    },
    refreshToken(applicationName) {
        return requests.post('application_token_refresh', { body: {'name': applicationName}});
    }
};

export default ApplicationFetcher;
