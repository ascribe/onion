'use strict';

import alt from '../alt';
import LicenseFetcher from '../fetchers/license_fetcher';


class LicenseActions {
    constructor() {
        this.generateActions(
            'updateLicenses'
        );
    }

    fetchLicense() {
        LicenseFetcher.fetch()
            .then((res) => {
                this.actions.updateLicenses(res.licenses);
            })
            .catch((err) => {
                console.logGlobal(err);
            });
    }
}

export default alt.createActions(LicenseActions);
