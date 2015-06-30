'use strict';

import alt from '../alt';
import LicenseActions from '../actions/license_actions';


class LicenseStore {
    constructor() {
        this.licenses = {};
        this.bindActions(LicenseActions);
    }

    onUpdateLicenses(licenses) {
        this.licenses = licenses;
    }
}

export default alt.createStore(LicenseStore, 'LicenseStore');
