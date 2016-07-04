'use strict';

import request from '../utils/request';

let ApplicationFetcher = {
    /**
     * Fetch the registered applications of a user from the API.
     */
    fetch() {
        return request('applications');
    },

    refreshToken(applicationName) {
        return request('application_token_refresh', {
            method: 'POST',
            jsonBody: { name: applicationName }
        });
    }
};

export default ApplicationFetcher;
