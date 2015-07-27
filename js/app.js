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
import { initLogging } from './utils/error_utils';

import EventActions from './actions/event_actions';
// require('./third_party/debug');
require('./third_party/ga');
require('./third_party/raven');
require('./third_party/intercom');

initLogging();

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

requests.defaults({
    urlMap: ApiUrls,
    http: {
        headers: headers,
        credentials: 'include'
    }
});



class AppGateway {

    start() {
        let settings;
        let subdomain = window.location.host.split('.')[0];

        try {
            settings = getSubdomainSettings(subdomain);
            appConstants.whitelabel = settings;
            updateApiUrls(settings.type, subdomain);
            this.load(settings);
        } catch(err) {
            // if there are no matching subdomains, we're routing
            // to the default frontend
            console.logGlobal(err);
            this.load();
        }
    }

    load(settings) {
        let type = 'default';
        if (settings) {
            type = settings.type;
        }

        EventActions.applicationWillBoot(settings);
        Router.run(getRoutes(type), Router.HistoryLocation, (App) => {
            React.render(
                <App />,
                document.getElementById('main')
            );
            EventActions.routeDidChange();
        });
        EventActions.applicationDidBoot(settings);
    }
}

let ag = new AppGateway();
ag.start();

