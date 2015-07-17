'use strict';

import alt from '../alt';
import ApplicationFetcher from '../fetchers/application_fetcher';


class ApplicationActions {
    constructor() {
        this.generateActions(
            'updateApplications'
        );
    }

    fetchApplication() {
        ApplicationFetcher.fetch()
            .then((res) => {
                this.actions.updateApplications(res.applications);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
    refreshApplicationToken(applicationName) {
        ApplicationFetcher.refreshToken(applicationName)
            .then((res) => {
                this.actions.updateApplications(res.applications);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(ApplicationActions);
