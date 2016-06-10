import React from 'react';
import { Redirect } from 'react-router';

import Routes from './routes';

import ApiUrls from './constants/api_urls';


function resolve({ subdomain, type }) {
    if (type === 'wallet') {
        return System.import('./components/whitelabel/wallet/wallet_app_resolver')
                     .then(({ default: WalletAppResolver }) => WalletAppResolver.resolve(subdomain));
    } else {
        return Promise.resolve({
            apiUrls: ApiUrls,
            redirectRoute: (<Redirect from="/" to="/collection" />),
            routes: Routes
        });
    }
}

export default { resolve };
