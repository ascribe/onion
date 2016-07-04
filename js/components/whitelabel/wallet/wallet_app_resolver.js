import React from 'react';
import Redirect from 'react-router/es6/Redirect';

import getWalletApiUrls from './constants/wallet_api_urls';
import getWalletRoutes from './wallet_routes';

import { mergeWithBaseApiUrls } from '../../../constants/api_urls';


function resolve(subdomain) {
    // Most whitelabels have landing pages so we should not automatically redirect from / to /collection.
    // Only cc does not have a landing page.
    const redirectRoute = subdomain === 'cc' ? (<Redirect from="/" to="/collection" />) : null;

    return {
        redirectRoute,
        apiUrls: mergeWithBaseApiUrls(getWalletApiUrls(subdomain)),
        routes: getWalletRoutes(subdomain)
    };
}

export default { resolve };
