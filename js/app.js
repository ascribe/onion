'use strict';

require('babel/polyfill');

import React from 'react';
import Router from 'react-router';

import fetch from 'isomorphic-fetch';

import ApiUrls from './constants/api_urls';
import { updateApiUrls } from './constants/api_urls';
import appConstants from './constants/application_constants';
import getRoutes from './routes';
import requests from './utils/requests';

import { getSubdomainSettings } from './utils/constants_utils';

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

requests.defaults({
    urlMap: ApiUrls,
    http: {
        headers: headers,
        credentials: 'include'
    },
    fatalErrorHandler: (err) => {
        console.log(err);
        //alert('Something went wrong, please reload the page');
    }
});

Raven.config('https://0955da3388c64ab29bd32c2a429f9ef4@app.getsentry.com/48351', {
    // pass along the version of your application
    release: '1.0.0'
}).install();

window.onerror = Raven.process;

class AppGateway {

    start() {
        let settings;
        let subdomain = window.location.host.split('.')[0];

        try {
            settings = getSubdomainSettings(subdomain);
            appConstants.whitelabel = settings;
            updateApiUrls(settings.type, subdomain);
            this.load(settings.type);
        } catch(err) {
            // if there are no matching subdomains, we're routing
            // to the default frontend
            this.load('default');
        }
    }

    load(type) {
        Router.run(getRoutes(type), Router.HistoryLocation, (App, state) => {
            if (window.ga) {
                window.ga('send', 'pageview');
            }
            React.render(
                <App />,
                document.getElementById('main')
            );
        });
    }
}

let ag = new AppGateway();
ag.start();
