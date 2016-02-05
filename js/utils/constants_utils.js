'use strict';

import AppConstants from '../constants/application_constants';

export function getDefaultSubdomainSettings() {
    return AppConstants.defaultDomain;
}

export function getSubdomainSettings(subdomain) {
    const settings = AppConstants.subdomains.filter((sdSettings) => subdomain === sdSettings.subdomain);

    if (settings.length === 1) {
        return settings[0];
    } else if (settings.length === 0) {
        console.warn('There are no subdomain settings for the subdomain: ' + subdomain);
        return AppConstants.defaultDomain;
    } else {
        throw new Error('Matched multiple subdomains. Adjust constants file.');
    }
}
