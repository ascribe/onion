'use strict';

import appConstants from '../constants/application_constants';

export function getSubdomainSettings(subdomain) {
    let settings = appConstants.subdomains.filter((sdSettings) => subdomain === sdSettings.subdomain);

    if(settings.length === 1) {
        return settings[0];
    } else if(settings.length === 0) {
        console.warn('There are no subdomain settings for the subdomain: ' + subdomain);
        return appConstants.defaultDomain;
    } else {
        throw new Error('Matched multiple subdomains. Adjust constants file.');
    }
}
