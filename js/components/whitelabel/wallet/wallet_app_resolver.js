import React from 'react';
import { Redirect } from 'react-router';

import getWalletApiUrls from './constants/wallet_api_urls';
import getWalletRoutes from './wallet_routes';

import { updateApiUrls } from '../../../constants/api_urls';


function resolve(subdomain) {
    // Most whitelabels have landing pages so we should not automatically redirect from / to /collection.
    // Only cc does not have a landing page.
    const redirectRoute = subdomain === 'cc' ? (<Redirect from="/" to="/collection" />) : null;

    return {
        redirectRoute,
        apiUrls: updateApiUrls(getWalletApiUrls(subdomain)),
        routes: getWalletRoutes(subdomain)
    };
}

export default { resolve };
