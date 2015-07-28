'use strict';

import appConstants from '../constants/application_constants';

export function getSubdomainSettings(subdomain) {
    let settings = appConstants.subdomains.filter((sdSettings) => subdomain === sdSettings.subdomain);

    if(settings.length === 1) {
        return settings[0];
    } else if(settings.length === 0) {
        return appConstants.defaultDomain;
        // throw new Error('There are no subdomain settings for the subdomain: ' + subdomain);
    } else {
        throw new Error('Matched multiple subdomains. Adjust constants file.');
    }
}
