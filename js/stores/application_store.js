'use strict';

import alt from '../alt';
import ApplicationActions from '../actions/application_actions';


class ApplicationStore {
    constructor() {
        this.applications = {};
        this.bindActions(ApplicationActions);
    }

    onUpdateApplications(applications) {
        this.applications = applications;
    }
}

export default alt.createStore(ApplicationStore, 'ApplicationStore');
